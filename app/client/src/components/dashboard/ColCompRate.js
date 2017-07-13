import React, { Component } from 'react';
import _ from 'lodash';
import async from 'async';
import { Card, CardText, Divider } from 'material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import { BasicColumn } from '../admin-components/charts';

class ColCompRate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            type: 'all',
            year: '1c',
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
        const { type } = this.state;
        return new Promise(resolve => {
            if (props.colleges.length < 1 || props.students.length < 1) resolve({});
            const colleges = _.keyBy(props.colleges, '_id');
            const colCompletionRate = [];
            const result = {};
            const q = async.queue((student, callback) => {
                const hsGradYear = student.hsGradYear;
                if (hsGradYear) {
                    result[hsGradYear] = result[hsGradYear] || _.cloneDeep(colCompletionRate);
                    const terms = student.terms;
                    if (terms.length > 0) {
                        const college = colleges[terms[0].college];         // should we be checking all terms?
                        if ( type == 'all' || type == college.durationType ) {  // allow filtering by duration type (2/4 year or both)
                            const gradRate = college.gradRate;
                            if (college && gradRate && gradRate.overall) {
                                result[hsGradYear].push(gradRate.overall);
                            }
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
            };
        });
    }

    chartData(data) {
        return [{ name: 'Average College Completion Rate', data: this.getRatio(data) }];
    }

    getRatio(data) {
        const yearlyData = [];
        _(data).keys().sort().forEach(key => {
            yearlyData.push(_.mean(data[key]) * 100);
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
                text: 'Average College Completion Rate of Institutions Attended'
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
                pointFormat:
                    '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
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
        )
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
                    <RaisedButton 
                        style={styles.raisedButton} 
                        primary={true} 
                        label="All" 
                        onClick={() => this.setType('all')} />
                    <RaisedButton
                        style={styles.raisedButton}
                        primary={true}
                        label="2 Year Schools"
                        onClick={() => this.setType('2 year')}
                    />
                    <RaisedButton
                        style={styles.raisedButton}
                        primary={true}
                        label="4 Year Schools"
                        onClick={() => this.setType('4 year')}
                    />
                </div>
                <Divider style={{ height: 2 }} />
                <Card>
                    <CardText>
                        This metric refers to the aggregated completion rate of institutions our graduates attended after high school. The
                        institutional completion rate is the percentage of students who graduated in 150% of the time (so 3 years for a 2
                        year degree and 6 years for a 4 year degree). The average completion rate nationwide is about 41%.
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

export default ColCompRate;
