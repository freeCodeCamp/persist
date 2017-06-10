import React, { Component } from 'react';
import Highcharts from 'highcharts';
import classNames from 'classnames';
import _ from 'lodash';
import randomColor from 'randomcolor';

class StackedColumn extends Component {
    constructor(props) {
        super(props);
        this.initialized = false;
    }

    componentWillReceiveProps(nextProps) {
        if (_.isEqual(this.props.data, nextProps.data)) return;
        if (!_.isEmpty(nextProps.data)) {
            if (!this.initialized) {
                this.initializeChart(nextProps.data);
                return;
            }
            this.chart.destroy();
            this.initializeChart(nextProps.data);
        }
    }

    componentDidMount() {
        if (!_.isEmpty(this.props.data)) {
            this.initializeChart();
        }
    }

    componentDidUpdate() {
        if (this.props.active && this.chart) {
            this.chart.reflow();
        }
    }

    formatData(data) {
        const formattedData = [];
        const keys = _.keys(data[0]);
        _.forEach(keys, key => {
            formattedData.push({
                name: key,
                data: _.map(data, key)
            });
        });
        return formattedData;
    }

    initializeChart(data = this.props.data) {
        this.initialized = true;
        this.chart = Highcharts.chart(this.component, {
            chart: {
                type: 'column'
            },
            xAxis: {
                categories: _.keys(data)
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of Students'
                },
                stackLabels: { enabled: true }
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                floating: true
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br />',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: this.formatData(_.values(data))
        });
    }

    render() {
        var style = {
            position: 'relative',
            height: '300px'
        };
        return (
            <div
                ref={c => (this.component = c)}
                className={classNames('chart tab-pane', { active: this.props.active })}
                id={this.props.id}
                style={style}
            >
                {this.props.children}
            </div>
        );
    }
}

export default StackedColumn;
