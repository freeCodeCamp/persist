import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Card, CardText, Divider } from 'material-ui';
import moment from 'moment';
import async from 'async';
import { BasicColumn } from '../admin-components/charts';

class ColDirEnrol extends Component {
    constructor(props) {
        super(props);
        this.refer = {
            '6 months': '6m',
            '12 months': '12m',
            '18 months': '18m'
        };
        this.state = {
            loading: true,
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

    diffMonths(dateA, dateB, diff) {
        return moment(dateA).diff(moment(dateB), 'months') < diff;
    }

    normalizeData(props) {
        return new Promise((resolve) => {
            if (props.students.length < 1) resolve({});
            const defaultEnrollmentData = {
                '6m': { count: 0, students: [] },
                '12m': { count: 0, students: [] },
                '18m': { count: 0, students: [] },
                'total': 0,
            };
            const result = {};
            const q = async.queue((student, callback) => {
                const hsGradYear = student.hsGradYear;
                if (hsGradYear) {
                    result[hsGradYear] = result[hsGradYear] || _.cloneDeep(defaultEnrollmentData);
                    const hsGradDate = student.hsGradDate;
                    let enrolDate;
                    student.terms = _.compact(student.terms);
                    if (student.terms.length > 0) {
                        enrolDate = _.last(student.terms).enrolBegin;
                    }
                    if (enrolDate && hsGradDate) {
                        if (this.diffMonths(enrolDate, hsGradDate, 6)) {
                            result[hsGradYear]['6m'].count += 1;
                            result[hsGradYear]['6m'].students.push(student.osis);
                        }
                        if (this.diffMonths(enrolDate, hsGradDate, 12)) {
                            result[hsGradYear]['12m'].count += 1;
                            result[hsGradYear]['12m'].students.push(student.osis);
                        }
                        if (this.diffMonths(enrolDate, hsGradDate, 18)) {
                            result[hsGradYear]['18m'].count += 1;
                            result[hsGradYear]['18m'].students.push(student.osis);
                        }
                    }
                    if (hsGradDate) {
                        result[hsGradYear]['total'] += 1;
                    }
                }
                setTimeout(() => {
                    callback();
                }, 0);
            }, 100);
            q.push(props.students);
            q.drain = () => {
                resolve(result);
            }
        });
    }

    chartData(data) {
        return [
            { name: '6 months', data: this.getRatio(data, '6m') },
            { name: '12 months', data: this.getRatio(data, '12m') },
            { name: '18 months', data: this.getRatio(data, '18m') }
        ]
    }

    getRatio(data, constant) {
        const yearlyData = [];
        _(data).keys().sort().forEach(key => {
            yearlyData.push(data[key][constant].count * 100 / data[key]['total']);
        });
        return yearlyData;
    }

    chartConfig() {
        const data = this.state.data;
        const { refer } = this;
        const { push } = this.props;
        const chartData = this.chartData(data);
        const config = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'College Direct Enrollment'
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
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.3f} %</b></td></tr>',
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
                                const { category, series: { name } } = this;
                                const students = data[category][refer[name]].students;
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

    render() {
        const hidden = this.state.loading ? { visibility: 'hidden' } : {};
        return (
            <div style={{ position: 'relative' }}>
                {this.state.loading ? this.renderLoading() : null}
                <div style={hidden}>
                    <BasicColumn {...this.props} config={this.chartConfig()}
                                 data={this.state.data} />
                </div>
                <Divider style={{ height: 2 }} />
                <Card>
                    <CardText>
                        College direct enrollment refers to the percentage of all graduates within a given year (January, June, or August) that enrolled in a college or approved vocational program within 6, 12, or 18 months of graduation. For January and June graduates, 6 month enrollment means students would be enrolled by the Fall after graduation, and for August graduates 6 month enrollment would include the following Spring.
                    </CardText>
                </Card>
            </div>
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        push
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(ColDirEnrol);
