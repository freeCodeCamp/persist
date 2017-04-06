import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {push} from 'react-router-redux';
import moment from 'moment';
import {CardText, Card, Divider} from 'material-ui';
import async from 'async';
import RaisedButton from 'material-ui/RaisedButton';
import {BasicColumn} from '../admin-components/charts';

class ColPersist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            year: '1c',
            data: []
        }
    }

    componentDidMount() {
        this.updateGraph(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            loading: true
        }, this.updateGraph.bind(this, nextProps));
    }

    updateGraph(props) {
        this.normalizeData(props).then((data) => {
            this.setState({
                data,
                loading: false
            });
        });
    }

    yearEnrol(terms, enrolDate, hsGradDate, hsGradYear, diff) {
        const colDir = moment(enrolDate).diff(moment(hsGradDate), 'months') < diff;
        if (!colDir) return false;
        const totalTerms = terms.length;
        const termsObj = _.keyBy(terms, 'name');
        let lastEnrolDate;
        let firstEnrolDate;
        switch (this.state.year) {
            case '1c':
                if (totalTerms < 2) return false;
                lastEnrolDate = terms[totalTerms - 2].enrolBegin;
                firstEnrolDate = terms[totalTerms - 1].enrolBegin;
                if (lastEnrolDate && firstEnrolDate) {
                    return moment(lastEnrolDate).diff(moment(firstEnrolDate), 'months') < 6;
                }
                return false;
            case '2c':
                if (totalTerms < 4) return false;
                lastEnrolDate = terms[totalTerms - 4].enrolBegin;
                firstEnrolDate = terms[totalTerms - 1].enrolBegin;
                if (lastEnrolDate && firstEnrolDate) {
                    return moment(lastEnrolDate).diff(moment(firstEnrolDate), 'months') < 18;
                }
                return false;
            case '1r':
                return (termsObj[`Spring ${hsGradYear + 1}`] || termsObj[`Fall ${hsGradYear + 1}`]);
            case '3r':
                return (termsObj[`Spring ${hsGradYear + 1}`] || termsObj[`Fall ${hsGradYear + 1}`]) &&
                    (termsObj[`Spring ${hsGradYear + 2}`] || termsObj[`Fall ${hsGradYear + 2}`]);
        }
    }

    normalizeData(props) {
        const students = props.students;
        const { year } = this.state;
        if (year === '1r' || year === '3r') {
            students.filter((student) => student.nscRecordFound);
        }
        return new Promise((resolve) => {
            if (props.students.length < 1) resolve({});
            const defaultEnrollmentData = {
                count: 0, students: [], total: 0
            };
            const result = {};
            const q = async.queue((student, callback) => {
                const hsGradYear = student.hsGradYear;
                if (hsGradYear) {
                    result[hsGradYear] = result[hsGradYear] || _.cloneDeep(defaultEnrollmentData);
                    const hsGradDate = student.hsGradDate;
                    let enrolDate;
                    const terms = student.terms;
                    if (terms.length > 0) {
                        enrolDate = _.last(terms).enrolBegin;
                    }
                    if (enrolDate && hsGradDate) {
                        if (this.yearEnrol(terms, enrolDate, hsGradDate, hsGradYear, 6)) {
                            result[hsGradYear].count += 1;
                            result[hsGradYear].students.push(student.osis);
                        }
                    }
                    if (hsGradDate) {
                        result[hsGradYear].total += 1;
                    }
                }
                setTimeout(() => {
                    callback();
                }, 0);
            }, 100);
            q.push(students);
            q.drain = () => {
                resolve(result);
            }
        });
    }

    chartData(data) {
        return [
            { name: '6 months', data: this.getRatio(data) },
        ]
    }

    getRatio(data) {
        const yearlyData = [];
        _(data).keys().sort().forEach(key => {
            yearlyData.push(data[key]['count'] * 100 / data[key]['total']);
        });
        return yearlyData;
    }

    chartConfig() {
        const data = this.state.data;
        const { push } = this.props;
        const chartData = this.chartData(data);
        const config = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'College Persistence'
            },
            xAxis: {
                categories: _(data).keys().sort().value(),
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Enrolled (%)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormatter: function() {
                    const { category, series } = this;
                    return `<tr>
                                <td style="color:${series.color};padding:0">${series.name}: </td>
                                <td style="padding:0">${data[category].count}=<b>${this.y.toFixed(3)} %</b></td>
                            </tr>`
                },
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    point: {
                        events: {
                            click: function() {
                                const { category } = this;
                                const students = data[category].students;
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
            <div style={{
                position: 'absolute', top: 0, bottom: 0, width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
                <i className='fa fa-cog fa-spin fa-3x fa-fw' />
            </div>
        )
    }

    setYear(year) {
        this.setState({
            loading: true,
            year
        }, this.updateGraph.bind(this, this.props));
    }

    render() {
        const hidden = this.state.loading ? { visibility: 'hidden' } : {};
        return (
            <div style={{ position: 'relative' }}>
                {this.state.loading ? this.renderLoading() : null}
                <div style={hidden}>
                    <BasicColumn {...this.props} config={this.chartConfig()}
                                 data={this.state.data} />
                </div>
                <div style={{ display: 'flex' }}>
                    <RaisedButton style={styles.raisedButton} primary={true} label='YR 1 Continuous Enrollment'
                                  onClick={() => this.setYear('1c')} />
                    <RaisedButton style={styles.raisedButton} primary={true} label='YR 2 Continuous Enrollment'
                                  onClick={() => this.setYear('2c')} />
                    <RaisedButton style={styles.raisedButton} primary={true} label='YR 1to2 Persist.'
                                  onClick={() => this.setYear('1r')} />
                    <RaisedButton style={styles.raisedButton} primary={true} label='YR 1to3 Persist.'
                                  onClick={() => this.setYear('3r')} />
                </div>
                <Divider style={{ height: 2 }} />
                <Card>
                    <CardText>
                        Our two primary ways of looking at college persistence are: 1. Continuous Enrollment and 2. Year to Year Persistence. All persistence metrics are calculated from the cohort of students who graduated the fall after graduating high school.
                    </CardText>
                    <CardText>
                        <b>Yr 1 Continuous Enrollment</b> calculates- of the students enrolled in the Fall after graduation, what percentage of them is also enrolled in the spring of that year.
                    </CardText>
                    <CardText>
                        <b>Yr1-2 Continuous Enrollment</b> calculates- of the students who are enrolled the Fall after graduation, what percentage of them are also enrolled in the spring of year 1 and the Fall and Spring semesters of their second year.
                    </CardText>
                    <CardText>
                        <b>Yr1 to Yr 2 Persistence</b> Of students who were enrolled in Fall after graduation, how many returned for at least one semester of year 2. This metric counts students even if they take a semester off as long as they return for either the fall of the spring of year 2. It is analogous to Freshman Retention rate.
                    </CardText>
                    <CardText>
                        <b>Yr 1 to Yr 3 Persistence</b> Of students who were enrolled in Fall after graduation, how many returned for at least one semester of year 2 and year 3. This metric counts students even if they take a semester off as long as they return for at least one semester each year.
                    </CardText>
                </Card>
            </div>
        )
    }

}

const styles = {
    raisedButton: {
        marginRight: '5px'
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        push
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(ColPersist);
