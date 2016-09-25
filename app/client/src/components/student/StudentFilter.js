import React from 'react';
import { connect } from 'react-redux';

import * as studentFilter from '../../actions/studentFilter';

import { reduxForm, Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';

import { Checkbox, RadioButtonGroup, SelectField, TextField, Toggle } from 'redux-form-material-ui';

class FilterStudentForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gender: 'M'
    };
  }

  handleFormSubmit(object) {
    console.log(object);
    this.props.filterStudents(object);
  }

  handleChange(value) {
    this.setState({
      gender: value
    });
  }

  render() {
    const {handleSubmit} = this.props;

    return (
      <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
        <div>
          <Field name='firstName' component={ TextField } floatingLabelText='First Name' />
        </div>
        <div>
          <Field name='lastName' component={ TextField } floatingLabelText='Last Name' />
        </div>
        <div>
          <Field name='gender'
            component={ SelectField }
            hintText='Gender'
            floatingLabelText='Gender'>
            <MenuItem value='M' primaryText='Male' />
            <MenuItem value='F' primaryText='Female' />
          </Field>
        </div>
        <div>
          <RaisedButton type='submit' label='Filter' primary={ true } />
        </div>
      </form>
      );
  }
}

FilterStudentForm = reduxForm({
  form: 'FilterStudent' // a unique name for this form
})(FilterStudentForm);

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(null, studentFilter)(FilterStudentForm);