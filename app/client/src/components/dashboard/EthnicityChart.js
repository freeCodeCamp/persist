import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {push} from 'react-router-redux';
import async from 'async';
import moment from 'moment';
import {mapping} from '../../../../common/constants';
import {BasicColumn} from '../admin-components/charts';

class EthnicityChart extends Component {
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

    normalizeData(props) {
        return new Promise((resolve) => {
            if (props.students.length < 1) resolve({});
            const defaultEnrollmentData = {};
            const keys = _.keys(mapping.ethnicity);
            keys.map((ethnicity) => {
                defaultEnrollmentData[ethnicity] = {count: 0, students: []}
            });
            const result = {};
            const q = async.queue((student, callback) => {
                const hsGradYear = student.hsGradYear;
                if (hsGradYear) {
                    result[hsGradYear] = result[hsGradYear] || _.cloneDeep(defaultEnrollmentData);
                    const hsGradDate = student.hsGradDate;
                    const ethnicity = student.ethnicity;
                    let enrolDate;
                    student.terms = _.compact(student.terms);
                    if (student.terms.length > 0) {
                        enrolDate = _.last(student.terms).enrolBegin;
                    }
                    if (
                        enrolDate &&
                        hsGradDate &&
                        moment(enrolDate).diff(moment(hsGradDate), 'months') < 6 &&
                        ethnicity
                    ) {
                        result[hsGradYear][ethnicity].count += 1;
                        result[hsGradYear][ethnicity].students.push(student.osis);
                    }
                }
                setTimeout(() => {
                    callback();
                }, 0);
            }, 20);
            q.push(props.students);
            q.drain = () => {
                resolve(result);
            }
        });
    }

    chartData(data) {
        const sortedYears = _(data).keys().sort().value();
        const values = sortedYears.map((key) => (data[key]));
        const keys = _.keys(values[0]);
        return keys.map(key => ({
            name: mapping.ethnicity[key],
            data: _(values).map(key)
                .map('count')
                .map(y => ({y, key}))
                .value()
        }));
    }

    chartConfig() {
        const data = this.state.data;
        const {push} = this.props;
        const chartData = this.chartData(data);
        const config = {
            chart: {
                type: 'column'
            },
            title: {
                text: '6 Month Enrollment by Ethnicity'
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
                formatter: function () {
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
                            click: function () {
                                const {category, key} = this;
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
            <div style={{
                position: 'absolute', top: 0, bottom: 0, width: '100%',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
                <i className='fa fa-cog fa-spin fa-3x fa-fw'/>
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

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        push
    }, dispatch);
};

export default connect(null, mapDispatchToProps)(EthnicityChart);
