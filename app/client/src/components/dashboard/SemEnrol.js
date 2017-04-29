import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import async from 'async';
import moment from 'moment';
import { BasicColumn } from '../admin-components/charts';

const mapping = {
    semType: {
        1: 'Enrolled Full time - 4 Year',
        2: 'Enrolled Part time - 4 Year',
        3: 'Enrolled Full time - 2 Year',
        4: 'Enrolled Part time - 2 Year',
        5: 'Military',
        6: 'Not Enrolled - Employed',
        7: 'Withdrawn or Deceased',
        8: 'Graduated',
        9: 'Unknown'
    }
};
let maxTermSeason;
let maxTermYear;
const currentDate = new Date();
if (moment(currentDate).diff(moment([currentDate.getFullYear(), 11, 30]), 'days') > 0) {
    maxTermSeason = 'Fall';
    maxTermYear = currentDate.getFullYear();
} else if (moment(currentDate).diff(moment([currentDate.getFullYear(), 6, 15]), 'days') > 0) {
    maxTermSeason = 'Spring';
    maxTermYear = currentDate.getFullYear();
} else {
    maxTermSeason = 'Fall';
    maxTermYear = currentDate.getFullYear() - 1;
}

class SemEnrol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
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

    normalizeData(props) {
        const { collegeObj } = props;
        return new Promise(resolve => {
            if (props.students.length < 1) resolve({});
            const defaultEnrollmentData = {};
            const keys = _.keys(mapping.semType);
            keys.map(semType => {
                defaultEnrollmentData[semType] = { count: 0, students: [] };
            });
            const result = {};
            _.times(8, n => {
                result[`Semester ${n + 1}`] = _.cloneDeep(defaultEnrollmentData);
            });
            const q = async.queue(
                (student, callback) => {
                    const studentTerms = student.terms;
                    const studentTermsObj = _.keyBy(studentTerms, 'name');
                    const hsGradYear = student.hsGradYear;
                    if (studentTerms.length > 0 && hsGradYear) {
                        let difference = 2 * (maxTermYear - hsGradYear);
                        if (maxTermSeason === 'Fall') {
                            difference += 1;
                        }
                        const maxTerms = Math.min(8, difference);
                        for (let i = 1; i <= maxTerms; i++) {
                            const year = hsGradYear + Math.floor(i / 2);
                            if ((i % 2 !== 0 && studentTermsObj['Fall ' + year]) || (i % 2 === 0 && studentTermsObj['Spring ' + year])) {
                                const term = i % 2 === 0 ? studentTermsObj['Spring ' + year] : studentTermsObj['Fall ' + year];
                                const { name, status, college } = term;
                                switch (status) {
                                    case 'F': {
                                        if (collegeObj[college].durationType === '4 year') {
                                            result['Semester ' + i][1].count += 1;
                                            result['Semester ' + i][1].students.push(student.osis);
                                        } else if (collegeObj[college].durationType === '2 year') {
                                            result['Semester ' + i][3].count += 1;
                                            result['Semester ' + i][3].students.push(student.osis);
                                        }
                                        break;
                                    }
                                    case 'H':
                                    case 'L':
                                    case 'Q': {
                                        if (collegeObj[college].durationType === '4 year') {
                                            result['Semester ' + i][2].count += 1;
                                            result['Semester ' + i][2].students.push(student.osis);
                                        } else if (collegeObj[college].durationType === '2 year') {
                                            result['Semester ' + i][4].count += 1;
                                            result['Semester ' + i][4].students.push(student.osis);
                                        }
                                        break;
                                    }
                                    case 'Military': {
                                        result['Semester ' + i][5].count += 1;
                                        result['Semester ' + i][5].students.push(student.osis);
                                        break;
                                    }
                                    case 'A':
                                    case 'Not Enrolled': {
                                        result['Semester ' + i][6].count += 1;
                                        result['Semester ' + i][6].students.push(student.osis);
                                        break;
                                    }
                                    case 'W':
                                    case 'D': {
                                        result['Semester ' + i][7].count += 1;
                                        result['Semester ' + i][7].students.push(student.osis);
                                        break;
                                    }
                                    case 'Graduated': {
                                        result['Semester ' + i][8].count += 1;
                                        result['Semester ' + i][8].students.push(student.osis);
                                        break;
                                    }
                                    default: {
                                        result['Semester ' + i][9].count += 1;
                                        result['Semester ' + i][9].students.push(student.osis);
                                        break;
                                    }
                                }
                            } else {
                                result['Semester ' + i][9].count += 1;
                                result['Semester ' + i][9].students.push(student.osis);
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
                20
            );
            q.push(props.students);
            q.drain = () => {
                resolve(result);
            };
        });
    }

    chartData(data) {
        const sortedYears = _(data).keys().sort().value();
        const values = sortedYears.map(key => data[key]);
        const keys = _.keys(values[0]);
        return keys.map(key => ({
            name: mapping.semType[key],
            data: _(values).map(key).map('count').map(y => ({ y, key })).value()
        }));
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
                text: 'Semester by Semester Enrollment'
            },
            xAxis: {
                categories: _(data).keys().sort().value(),
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Enrolled'
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
            </div>
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
            </div>
        );
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(SemEnrol);
