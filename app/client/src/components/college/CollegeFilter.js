import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { Button, Form, Label, Input, Container, InputGroup, Row, FormGroup } from 'react-bootstrap';

import * as collegeFilter from '../../actions/collegeFilter';


class FilterCollegeForm extends React.Component {
  constructor(props) {
    super(props);

  }

  handleFormSubmit(object) {

    this.props.filterColleges(object);

  }

  render() {

    const {handleSubmit, reset} = this.props;

    return (

      <Form id='college-filter' onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
        Filter
        <FormGroup>
          <Label htmlFor='fullName'>
            Full Name
          </Label>
          <Field className='form-control'
            name='fullName'
            component='input'
            type='text' />
          <Button type='submit'>
            Submit
          </Button>
        </FormGroup>
      </Form>

      );
  }
}

FilterCollegeForm = reduxForm({
  form: 'FilterCollege' // a unique name for this form
})(FilterCollegeForm);

/*
function mapStateToProps(state) {
  return { filteredStudents: state.filteredStudents };
}
*/

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(
  null, collegeFilter
)(FilterCollegeForm)





