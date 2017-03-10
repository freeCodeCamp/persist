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

class AvgTimeGrad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            durationType: '2 year',
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

    yearEnrol(terms, hsGradDate) {
        const { durationType } = this.state;
        const { collegeObj } = this.props;
        for (let term of terms) {
            if (term.status === 'Graduated' && term.enrolEnd && _.get(collegeObj, `${term.college}.durationType`, '') === durationType) {
                const monthsTaken = moment(term.enrolEnd).diff(moment(hsGradDate), 'months');
                if (monthsTaken) {
                    return monthsTaken;
                }
                return false;
            }
        }
        return false;
    }

    normalizeData(props) {
        return new Promise((resolve) => {
            if (props.students.length < 1) resolve({});
            const defaultEnrollmentData = {
                count: 0, students: [], total: 0
            };
            const result = {};
            const q = async.queue((student, callback) => {
                const hsGradYear = student.hsGradYear;
                if (hsGradYear) {
                    result[hsGradYear] = result[hsGradYear] || _.clone(defaultEnrollmentData);
                    const hsGradDate = student.hsGradDate;
                    const terms = student.terms;
                    if (hsGradDate) {
                        const timeTaken = this.yearEnrol(terms, hsGradDate);
                        if (timeTaken) {
                            result[hsGradYear].count += timeTaken / 12;
                            result[hsGradYear].students.push(student.osis);
                            result[hsGradYear].total += 1;
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
            { name: 'Average Time to Graduation', data: this.getRatio(data) },
        ]
    }

    getRatio(data) {
        const yearlyData = [];
        _(data).keys().sort().forEach(key => {
            yearlyData.push(data[key]['count'] / data[key]['total']);
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
                text: 'Average Time to Graduation'
            },
            xAxis: {
                categories: _(data).keys().sort().value(),
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Time (years)'
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

    setDurationType(durationType) {
        this.setState({
            loading: true,
            durationType
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
                    <RaisedButton style={styles.raisedButton} primary={true} label='2 year'
                                  onClick={() => this.setDurationType('2 year')} />
                    <RaisedButton style={styles.raisedButton} primary={true} label='4 year'
                                  onClick={() => this.setDurationType('4 year')} />
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

const mapStateToProps = (state) => ({
    collegeObj: state.colleges.idObj
});

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        push
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AvgTimeGrad);
