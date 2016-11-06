import React, {Component} from 'react';
import classNames from 'classnames';
import randomColor from 'randomcolor';

class Donut extends Component {

  constructor(props) {
    super(props);
    this.initialized = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.length > 0) {
      if (!this.initialized) {
        this.initializeChart(nextProps.data);
        return;
      }
      this.donut.setData(nextProps.data);
    }
  }

  componentDidMount() {
    if (this.props.data.length > 0) {
      this.initializeChart();
    }
  }

  componentDidUpdate() {
    if (this.props.active && this.donut) {
      this.donut.resizeHandler();
    }
  }

  initializeChart(data = this.props.data) {
    this.initialized = true;
    this.donut = new Morris.Donut({
      element: this.props.id,
      resize: true,
      colors: randomColor({luminosity: 'dark', hue: 'random', count: data.length}),
      data: data,
      hideHover: 'auto'
    });
  }

  render() {
    var style = {
      position: 'relative',
      height: '300px'
    };

    return (
      <div className={classNames('chart tab-pane', {active: this.props.active})} id={ this.props.id } style={ style }>
        { this.props.children }
      </div>
    );
  }
}

export default Donut;