import React, { Component } from 'react';
import Highcharts from 'highcharts';
import classNames from 'classnames';
import _ from 'lodash';

class BasicColumn extends Component {
    constructor(props) {
        super(props);
        this.initialized = false;
    }

    componentWillReceiveProps(nextProps) {
        if (_.isEqual(this.props.data, nextProps.data)) return;
        if (!_.isEmpty(nextProps.data)) {
            if (!this.initialized) {
                this.initializeChart(nextProps.config);
                return;
            }
            this.chart.destroy();
            this.initializeChart(nextProps.config);
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

    initializeChart(config = this.props.config) {
        console.log('initialize');
        this.initialized = true;
        window.config = config;
        window.chartComponent = this.component;
        window.Highcharts = Highcharts;
        this.chart = Highcharts.chart(this.component, config);
    }

    render() {
        var style = {
            position: 'relative',
            height: '300px'
        };
        return (
            <div
                ref={c => this.component = c}
                className={classNames('chart tab-pane', { active: this.props.active })}
                id={this.props.id}
                style={style}
            >
                {this.props.children}
            </div>
        );
    }
}

export default BasicColumn;
