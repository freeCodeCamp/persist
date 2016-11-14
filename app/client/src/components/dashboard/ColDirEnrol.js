import React, {Component} from 'react';
import _ from 'lodash';
import moment from 'moment';
import async from 'async';
import {BasicColumn} from '../admin-components/charts';

class ColDirEnrol extends Component {
    constructor(props) {
        super(props);
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
                '6m': 0,
                '12m': 0,
                '18m': 0,
                'total': 0
            };
            const result = {};
            const q = async.queue((student, callback) => {
                const hsGradYear = student.hsGradYear;
                if (hsGradYear) {
                    result[hsGradYear] = result[hsGradYear] || _.clone(defaultEnrollmentData);
                    const hsGradDate = student.hsGradDate;
                    let enrolDate;
                    student.terms = _.compact(student.terms);
                    if (student.terms.length > 0) {
                        enrolDate = _.last(student.terms).enrolBegin;
                    }
                    if (enrolDate && hsGradDate) {
                        if (this.diffMonths(enrolDate, hsGradDate, 6)) {
                            result[hsGradYear]['6m'] += 1;
                        }
                        if (this.diffMonths(enrolDate, hsGradDate, 12)) {
                            result[hsGradYear]['12m'] += 1;
                        }
                        if (this.diffMonths(enrolDate, hsGradDate, 18)) {
                            result[hsGradYear]['18m'] += 1;
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
            {name: '6 months', data: this.getRatio(data, '6m')},
            {name: '12 months', data: this.getRatio(data, '12m')},
            {name: '18 months', data: this.getRatio(data, '18m')}
        ]
    }

    getRatio(data, constant) {
        const yearlyData = [];
        _(data).keys().sort().forEach(key => {
            yearlyData.push(data[key][constant] / data[key]['total']);
        });
        return yearlyData;
    }

    chartConfig() {
        const data = this.state.data;
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
                    borderWidth: 0
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
                <i className="fa fa-cog fa-spin fa-3x fa-fw"></i>
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    render() {
        const hidden = this.state.loading ? {visibility: 'hidden'} : {};
        return (
            <div style={{position: 'relative'}}>
                {this.state.loading ? this.renderLoading() : null}
                <div style={hidden}>
                    <BasicColumn {...this.props} config={this.chartConfig()}
                                 data={this.state.data}/>
                </div>
            </div>
        )
    }

}

export default ColDirEnrol;