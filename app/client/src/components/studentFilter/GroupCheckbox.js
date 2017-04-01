import React, { Component } from 'react';
import {Checkbox} from 'material-ui';

class GroupCheckbox extends Component {
    constructor() {
        super();
    }

    render() {
        const {checked, changeState, label} = this.props;
        return (
            <Checkbox
                onCheck={(e, v) => changeState(label, v)}
                checked={checked}
                label={label}
            />
        );
    }
}

export default GroupCheckbox;
