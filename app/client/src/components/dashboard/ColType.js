import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { RaisedButton } from 'material-ui';
import async from 'async';
import { mapping } from '../../../../common/constants';
import { BasicColumn } from '../admin-components/charts';

mapping.colType = {
    ...mapping.collType,
    1: 'CUNY 2 Year',
    2: 'SUNY 2 Year',
    7: 'CUNY 4 Year',
    8: 'SUNY 4 Year'
};

class ColType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            durationType: 'all'
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
        const { collegeObj } = this.props;
        const { durationType } = this.state;
        return new Promise(resolve => {
            if (props.students.length < 1) resolve({});
            const defaultColTypeData = {};
            _.times(8, n => {
                defaultColTypeData[n + 1] = { count: 0, students: [] };
            });
            const result = {};
            const q = async.queue(
                (student, callback) => {
                    const hsGradYear = student.hsGradYear;
                    if (hsGradYear) {
                        result[hsGradYear] = result[hsGradYear] || _.cloneDeep(defaultColTypeData);
                        let colType;
                        student.terms = _.compact(student.terms);
                        if (student.terms.length > 0) {
                            const college = collegeObj[_.last(student.terms).college];
                            if ((college.durationType && college.durationType === durationType) || durationType === 'all') {
                                colType = college.collType;
                                if (colType === 1) {
                                    switch (college.durationType) {
                                        case '2 year':
                                            colType = 1;
                                            break;
                                        case '4 year':
                                            colType = 7;
                                            break;
                                        default:
                                            colType = undefined;
                                    }
                                } else if (colType === 2) {
                                    switch (college.durationType) {
                                        case '2 year':
                                            colType = 2;
                                            break;
                                        case '4 year':
                                            colType = 8;
                                            break;
                                        default:
                                            colType = undefined;
                                    }
                                }
                                if (colType) {
                                    result[hsGradYear][colType].count += 1;
                                    result[hsGradYear][colType].students.push(student.osis);
                                }
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
            name: mapping.colType[key],
            data: _(values).map(key).map('count').map(y => ({ y, key })).value()
        }));
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
                text: 'College Type'
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
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    setYear(year) {
        this.setState(
            {
                loading: true,
                durationType: year
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
                    <RaisedButton style={styles.raisedButton} primary={true} label="All" onClick={() => this.setYear('all')} />
                    <RaisedButton
                        style={styles.raisedButton}
                        primary={true}
                        label="2 Year College"
                        onClick={() => this.setYear('2 year')}
                    />
                    <RaisedButton
                        style={styles.raisedButton}
                        primary={true}
                        label="4 Year College"
                        onClick={() => this.setYear('4 year')}
                    />
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ColType);
