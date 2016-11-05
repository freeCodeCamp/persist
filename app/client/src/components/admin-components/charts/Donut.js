import React, { Component } from 'react';

class Donut extends Component {

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.donut.setData(nextProps.data);
  }

  componentDidMount() {
    this.donut = new Morris.Donut({
      element: this.props.id,
      resize: true,
      colors: this.props.colors,
      data: this.props.data,
      hideHover: 'auto'
    });
  }

  render() {
    var style = {
      position: 'relative',
      height: '300px'
    };

    return (
      <div className='chart tab-pane active' id={ this.props.id } style={ style }>
        <p>
          { this.props.title }
        </p>
        { this.props.children }
      </div>
      );
  }
}

export default Donut;