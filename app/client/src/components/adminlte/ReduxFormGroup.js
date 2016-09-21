import React from 'react';
import { Field } from 'redux-form';
// import  { connect } from 'react-redux';

import { FormGroup, Label } from 'reactstrap';

class ReduxFormGroup extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {

        return (
                <FormGroup>
                    <Label htmlFor={this.props.name}>{this.props.children}</Label>
                    <Field className='form-control' disabled={!this.props.disabled} name={this.props.name} component='input' type='text'/>
                </FormGroup>
        	);
    }
}

export default ReduxFormGroup;