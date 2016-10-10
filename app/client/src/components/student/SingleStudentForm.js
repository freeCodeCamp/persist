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

    const returnFormGroups = (reference) => {
        return reference.map((field, i) => {
            return (
              <div className='col-lg-3 col-md-4 col-sm-6 col-xs-12' key={ i }>
                <FormGroup initValue={ this.props.initialValues[field.dbName] } disabled={ this.state.editable } field={ field }>
                  { field.dbName }
                </FormGroup>
              </div>
              );
            });
    };

    const filterRef = (dbNames) => {
        return reference.filter((field) => dbNames.includes(field.dbName))
    };

    const bioHTML = returnFormGroups(filterRef(['altName', 'dob', 'hs', 'hsGradYear', 'hsGPA', 'tags']));
    const contactHTML = returnFormGroups(filterRef(['cellPhone', 'email', 'otherPhone', 'address', 'residency' ]));
    const academicHTML = returnFormGroups(filterRef(['mostRecentCol', 'majorMinor', 'studentSupportOrgName', 'progressToGradAss', 'degreeTitle', 'intendedCollege', 'remediationStatus', 'progressToGradBa', 'gradDate', 'hsGPA', 'transferStatus', 'progressToMasters']));
    const financialHTML = returnFormGroups(filterRef(['mostRecentEmp', 'employmentStatus', 'startedFafsa', 'completedFafsa', 'completedTap', 'needGap', 'amountOfNeedGap']));
    const notesHTML = returnFormGroups(filterRef(['riskFactors', 'needsFollowup']));

    return (
      <div id="single-student-page">
        <Form className='single-student-form' onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
          <Row>
          <br/>
          <h2> Biographical Information </h2>
          {bioHTML}
          <br/>
          <h2 style={{clear: 'both', textAlign: 'center'}}> Student Contact </h2>
          {contactHTML}
          <br/>
          <h2> Academic Profile </h2>
          {academicHTML}
          <br/>
          <h2> Financial Profile </h2>
          {financialHTML}
          <br/>
          <h2> Student Notes </h2>
          {notesHTML}
          <br/>
        
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

export default connect(
  mapStateToProps
)(SingleStudentForm)





