import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import async from 'async';
import { Card, CardText, Divider } from 'material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import { BasicColumn } from '../admin-components/charts';

class GradRate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            type: '2 year',
            data: []
        };
    }

    componentDidMount() {
        this.updateGraph(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(
            {
                loading: true
            },
            this.updateGraph.bind(this, nextProps)
        );
    }

    updateGraph(props) {
        this.normalizeData(props).then(data => {
            this.setState({
                data,
                loading: false
            });
        });
    }

    yearEnrol(student) {
        const { collegeObj } = this.props;
        const terms = student.terms;
        const totalTerms = terms.length;
        let factor = 1, transferred, graduated;
        switch (this.state.type) {
            case '2 year 150%':
                factor = 1.5;
            case '2 year': {
                if (totalTerms < 1) return false;
                const firstTerm = terms[totalTerms - 1];
                if (collegeObj[firstTerm.college].durationType !== '2 year') return false;
                const lastEnrolDate = terms[0].enrolBegin;
                const firstEnrolDate = firstTerm.enrolBegin;
                if (
                    lastEnrolDate &&
                    firstEnrolDate &&
                    collegeObj[firstTerm.college] &&
                    collegeObj[terms[0].college].durationType === '4 year'
                ) {
                    transferred = true;
                }
                const graduationTerm = terms.find(
                    term =>
                        term.status === 'Graduated' &&
                        _.get(collegeObj, `${term.college}.durationType`, null) === '2 year' &&
                        moment(term.enrolBegin).diff(moment(firstEnrolDate), 'months') < (24 + 2) * factor
                );
                if (graduationTerm) {
                    graduated = true;
                }
                if (graduated) {
                    if (transferred) {
                        return ['transferred with degree', 'total'];
                    } else {
                        return ['graduated', 'total'];
                    }
                }
                if (transferred) {
                    return ['transferred without degree', 'total'];
                }
                if (moment(new Date()).diff(moment(terms[0].enrolBegin), 'months') < 6) {
                    return ['Currently Enrolled', 'total'];
                }
                return ['No longer Enrolled', 'total'];
            }
            case '4 year 150%':
                factor = 1.5;
            case '4 year': {
                if (totalTerms < 1) return false;
                const firstCollege = collegeObj[terms[totalTerms - 1].college];
                if (firstCollege.durationType !== '4 year') return false;
                const graduations = terms.filter(
                    term => term.status === 'Graduated' && _.get(collegeObj, `${term.college}.durationType`, null) === '4 year'
                );
                if (
                    graduations.length > 0 &&
                    moment(graduations[0].enrolEnd).diff(moment(graduations[0].enrolBegin), 'months') < (48 + 4) * factor
                ) {
                    return ['graduated', 'total'];
                }
                if (moment(new Date()).diff(moment(terms[0].enrolBegin), 'months') < 6) {
                    return ['Currently Enrolled', 'total'];
                }
                return ['No longer Enrolled', 'total'];
            }
        }
    }

    normalizeData(props) {
        return new Promise(resolve => {
            if (props.students.length < 1) resolve({});
            const defaultEnrollmentData = {
                transferred: { count: 0, students: [] },
                graduated: { count: 0, students: [] },
                'transferred without degree': { count: 0, students: [] },
                'transferred with degree': { count: 0, students: [] },
                'No longer Enrolled': { count: 0, students: [] },
                'Currently Enrolled': { count: 0, students: [] },
                total: 0
            };
            const result = {};
            const q = async.queue(
                (student, callback) => {
                    const hsGradYear = student.hsGradYear;
                    if (hsGradYear) {
                        result[hsGradYear] = result[hsGradYear] || _.cloneDeep(defaultEnrollmentData);
                        const hsGradDate = student.hsGradDate;
                        let enrolDate;
                        const terms = student.terms;
                        if (terms.length > 0) {
                            enrolDate = _.last(terms).enrolBegin;
                        }
                        if (enrolDate && hsGradDate && moment(enrolDate).diff(moment(hsGradDate), 'months') < 6) {
                            const fields = this.yearEnrol(student);
                            if (fields) {
                                fields.map(field => {
                                    if (_.isPlainObject(result[hsGradYear][field])) {
                                        result[hsGradYear][field].count += 1;
                                        result[hsGradYear][field].students.push(student.osis);
                                    } else {
                                        result[hsGradYear][field] += 1;
                                    }
                                });
                            }
                        }
                    }
                    setTimeout(
                        () => {
                            callback();
                        },
                        0
                    );
                },
                100
            );
            q.push(props.students);
            q.drain = () => {
                resolve(result);
            };
        });
    }

    chartData(data) {
        const { type } = this.state;
        const sortedYears = _(data).keys().sort().value();
        const values = sortedYears.map(key => data[key]);
        const graduated = {
            name: 'Graduated',
            data: values.map(key => ({
                y: key.graduated.count,
                key: 'graduated'
            }))
        };
        const transferred = {
            name: 'Transferred',
            data: values.map(key => ({
                y: key.transferred.count,
                key: 'transferred'
            }))
        };
        const currentlyEnrolled = {
            name: 'Currently Enrolled',
            data: values.map(key => ({
                y: key['Currently Enrolled'].count,
                key: 'Currently Enrolled'
            }))
        };
        const noLongerEnrolled = {
            name: 'No longer Enrolled',
            data: values.map(key => ({
                y: key['No longer Enrolled'].count,
                key: 'No longer Enrolled'
            }))
        };
        if (type === '2 year 150%' || type === '4 year 150%') {
            return [
                graduated,
                transferred,
                {
                    name: 'Did not Graduate',
                    data: values.map(key => ({
                        y: key['Currently Enrolled'].count +
                            key['No longer Enrolled'].count +
                            key['transferred with degree'].count +
                            key['transferred without degree'].count,
                        key: 'Did not Graduate'
                    }))
                }
            ];
        }
        if (type === '4 year') {
            return [graduated, transferred, currentlyEnrolled, noLongerEnrolled];
        }
        return [
            graduated,
            {
                name: 'Transferred Without Degree',
                data: values.map(key => ({
                    y: key['transferred without degree'].count,
                    key: 'transferred without degree'
                }))
            },
            {
                name: 'Transferred With Degree',
                data: values.map(key => ({
                    y: key['transferred with degree'].count,
                    key: 'transferred with degree'
                }))
            },
            currentlyEnrolled,
            noLongerEnrolled
        ];
    }

    chartConfig() {
        const { data } = this.state;
        const { push } = this.props;
        const chartData = this.chartData(data);
        const config = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Graduation Rate'
            },
            xAxis: {
                categories: _(data).keys().sort().value(),
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Students'
                }
            },
            tooltip: {
                formatter: function() {
                    const percent = Math.round(this.y * 10000 / this.total) / 100;
                    return this.y + '=<b>' + percent + '%</b><br/>' + 'Total: ' + this.total;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    pointPadding: 0.2,
                    borderWidth: 0,
                    point: {
                        events: {
                            click: function() {
                                const { category, key } = this;
                                const students = data[category][key].students;
                                localStorage.setItem('filtered', JSON.stringify(students));
                                push('/filtered');
                            }
                        }
                    }
                },
                series: {
                    cursor: 'pointer'
                }
            },
            series: chartData
        };
        return config;
    }

    renderLoading() {
        return (
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <i className="fa fa-cog fa-spin fa-3x fa-fw" />
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    setType(type) {
        this.setState(
            {
                loading: true,
                type
            },
            this.updateGraph.bind(this, this.props)
        );
    }

    render() {
        const hidden = this.state.loading ? { visibility: 'hidden' } : {};
        return (
            <div style={{ position: 'relative' }}>
                {this.state.loading ? this.renderLoading() : null}
                <div style={hidden}>
                    <BasicColumn {...this.props} config={this.chartConfig()} data={this.state.data} />
                </div>
                <div style={{ display: 'flex' }}>
                    <RaisedButton style={styles.raisedButton} primary={true} label="2 Year" onClick={() => this.setType('2 year')} />
                    <RaisedButton style={styles.raisedButton} primary={true} label="4 Year" onClick={() => this.setType('4 year')} />
                    <RaisedButton
                        style={styles.raisedButton}
                        primary={true}
                        label="2 Year 150%"
                        onClick={() => this.setType('2 year 150%')}
                    />
                    <RaisedButton
                        style={styles.raisedButton}
                        primary={true}
                        label="4 Year 150%"
                        onClick={() => this.setType('4 year 150%')}
                    />
                </div>
                <Divider style={{ height: 2 }} />
                <Card>
                    <CardText>
                        Students are only listed as having graduated once we have confirmed their graduation record. Frequently there are significant delays in getting graduation records from the National Student Clearinghouse.
                    </CardText>
                </Card>
            </div>
        );
    }
}

const styles = {
    raisedButton: {
        marginRight: '5px'
    }
};

const mapStateToProps = state => ({
    collegeObj: state.colleges.idObj
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            push
        },
        dispatch
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(GradRate);
