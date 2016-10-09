import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { Button, Form, Row } from 'react-bootstrap';

import FormGroup from '../helpers/ReduxFormGroup';
import CollegeSummary from './CollegeSummary';
import CollegeTermRecords from './CollegeTermRecords';

import { reference } from '../../../../server/helpers/key';
import asyncValidate from '../helpers/asyncValidate';

class SingleStudentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false
    };
  }

  handleFormSubmit(object) {
    //this will handle updates
    console.log('this is our form object', object);
    this.setState({
      editable: !this.state.editable
    });
  }

  toggleEdit() {
    this.setState({
      editable: !this.state.editable
    });
  }

  render() {

    const {handleSubmit, reset} = this.props;

    const exceptions = [];

    const bioFields = ['altName', 'dob', 'hs', 'hsGradYear', 'hsGPA', 'tags'];
    const contactFields = [];
    const academicFields = []
    const financialFieds = [];
    const notesFields = [];
    const caseNotes = [];
    const enrollmentFields = [];
    console.log(this.props);

    var inputHTML = reference.map((field, i) => {
      return (
        <div className='col-lg-3 col-md-4 col-sm-6 col-xs-12' key={ i }>
          <FormGroup initValue={ this.props.initialValues[field.dbName] } disabled={ this.state.editable } field={ field }>
            { field.dbName }
          </FormGroup>
        </div>
        );
    });


    // var inputHTML = Object.keys(keys).map((key, i) => {
    //   // if (exceptions.include(key)) {
    //   //     return null;
    //   // }
    //   return (
    //     <div className='col-md-6' key={ i }>
    //       <FormGroup disabled={ this.state.editable } name={ keys[key] }>
    //         { key }
    //       </FormGroup>
    //     </div>
    //   )
    // });

    return (
      <div id="single-student-page">
        <Form className='single-student-form' onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
          <Row>
            { inputHTML }
          </Row>
          { this.state.editable ? <div>
                                    <Button type="submit">
                                      Submit
                                    </Button>
                                    <Button type="button" onClick={ reset }>
                                      Undo Changes
                                    </Button>
                                  </div> : <Button type="button" onClick={ () => this.toggleEdit() }>
                                             Edit
                                           </Button> }
        </Form>
      </div>

      );
  }
}

SingleStudentForm = reduxForm({
  form: 'SingleStudent',
  asyncValidate
})(SingleStudentForm);

function mapStateToProps(state) {
  return {
    studentForm: state.form
  };
}

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(
  mapStateToProps
)(SingleStudentForm)





