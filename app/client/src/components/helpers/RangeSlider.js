import React from 'react';
import {Field} from 'redux-form';

export default class RangeSlider extends React.Component {

    constructor(props) {
        super(props);
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
        const {form, name} = this.props;
        form.props.change.bind(form, `${name}.min`, data.from)();
        form.props.change.bind(form, `${name}.max`, data.to)();
    }

    render() {
        const {defaultRange, min, max, step, name} = this.props;
        const data_attr = {
            'data-type': 'double',
            'data-min': min,
            'data-max': max,
            'data-step': step,
            'data-from': defaultRange.minValue,
            'data-to': defaultRange.maxValue
        };

        return (
            <div style={{
                width: 256,
                height: 72,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around'
            }}>
                <label htmlFor={name}>{name}</label>
                <input ref={(c) => {
                    this.slider = c;
                }} type='text' id={name} name={name} {...data_attr} />
            </div>
        );
    }
}