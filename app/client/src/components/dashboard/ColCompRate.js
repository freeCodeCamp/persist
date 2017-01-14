import React, {Component} from 'react';
import _ from 'lodash';
import async from 'async';
import {BasicColumn} from '../admin-components/charts';

class ColCompRate extends Component {
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

    normalizeData(props) {
        return new Promise((resolve) => {
            if (props.colleges.length < 1 || props.students.length < 1) resolve({});
            const colleges = _.keyBy(props.colleges, '_id');
            const colCompletionRate = [];
            const result = {};
            const q = async.queue((student, callback) => {
                const hsGradYear = student.hsGradYear;
                if (hsGradYear) {
                    result[hsGradYear] = result[hsGradYear] || _.clone(colCompletionRate);
                    const terms = student.terms;
                    if (terms.length > 0) {
                        const college = colleges[terms[0].college];
                        const gradRate = college.gradRate.overall;
                        if (college && gradRate) {
                            result[hsGradYear].push(gradRate);
                        }
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
            {name: 'Average College Completion Rate', data: this.getRatio(data)}
        ]
    }

    getRatio(data) {
        const yearlyData = [];
        _(data).keys().sort().forEach(key => {
            yearlyData.push(_.mean(data[key]) * 100)
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
                text: 'Average College Completion Rate'
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
                <i className='fa fa-cog fa-spin fa-3x fa-fw'></i>
                <span className='sr-only'>Loading...</span>
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

const styles = {
    raisedButton: {
        marginRight: '5px'
    }
};

export default ColCompRate;