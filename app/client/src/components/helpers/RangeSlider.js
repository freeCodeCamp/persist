import React from 'react';
import {Field} from 'redux-form';

export default class RangeSlider extends React.Component {

  constructor(props) {
    super(props);
    this.fieldName = this.props.name;
  }

  componentDidMount() {
    this.initializeSlider();
  }

  componentDidUpdate() {
    this.initializeSlider();
  }

  initializeSlider() {
    $(this.slider).ionRangeSlider({
      onStart: (data) => {
        this.dispatchChange(data);
      },
      // onChange: (data) => {
      //   this.dispatchChange(data);
      // },
      onFinish: (data) => {
        this.dispatchChange(data);
      },
      onUpdate: (data) => {
        this.dispatchChange(data);
      }
    });
  }

  dispatchChange(data) {
    const dispatch = this.props.meta.dispatch;
    dispatch({
      type: 'redux-form/CHANGE',
      meta: {
        form: this.props.form,
        field: `${this.fieldName}.min`
      },
      payload: data.from
    });
    dispatch({
      type: 'redux-form/CHANGE',
      meta: {
        form: this.props.form,
        field: `${this.fieldName}.max`
      },
      payload: data.to
    });
  }

  render() {
    const {defaultRange, min, max, step} = this.props;
    const data_attr = {
      'data-type': 'double',
      'data-min': min,
      'data-max': max,
      'data-step': step,
      'data-from': defaultRange.minValue,
      'data-to': defaultRange.maxValue
    };

    return (
      <div style={{width: 256, height: 72, display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
        <label htmlFor={this.fieldName}>{this.fieldName}</label>
        <input ref={(c) => {
          this.slider = c;
        }} type='text' id={this.fieldName} name={this.fieldName} {...data_attr} />
      </div>
    );
  }
}