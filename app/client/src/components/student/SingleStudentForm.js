import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { Button, Form, Row, Alert } from 'react-bootstrap';

import FormGroup from '../helpers/ReduxFormGroup';
import CollegeSummary from './CollegeSummary';
import CollegeTermRecords from './CollegeTermRecords';

import * as updateStudent from '../../actions/updateStudent';

import { reference } from '../../../../server/helpers/key';
import asyncValidate from '../helpers/asyncValidate';

class SingleStudentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false
    };
  }

  handleFormSubmit(studentRecord) {
    //this will handle updates
    console.log('this is our form object', studentRecord);

    // lets find the changed data

    this.props.updateStudent(studentRecord);
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

      // vars for editing
      const fixed = ['hs', 'hsGradYear', 'hsAttended'];

      // initial value var
      let initialValue;

      return reference.map((field, i) => {

        // get fixed non-editable fields
        let editable = this.state.editable;
        if (fixed.includes(field.dbName)) {
          editable = false;
        }

        initialValue = this.props.initialValues[field.dbName];

        if (field.dbName === 'hsGradYear') {
          if (this.props.initialValues['hsGradDate']) {
            const date = new Date(this.props.initialValues['hsGradDate'])
            initialValue = date.getFullYear();
          }
        }

        return (
            <FormGroup style={{margin: '50px', textAlign: 'center'}} initValue={ initialValue } key={i} disabled={ editable } field={ field }>
              { field.dbName }
            </FormGroup>
          );
      });
    };

    const filterRef = (dbNames) => {
      return reference.filter((field) => dbNames.includes(field.dbName))
    };

    const bioHTML = returnFormGroups(filterRef(['altName', 'dob', 'hs', 'hsGradYear', 'hsGPA', 'tags']));
    const contactHTML = returnFormGroups(filterRef(['cellPhone', 'email', 'otherPhone', 'address', 'residency', 'facebookName', 'parentPhone']));
    const academicHTML = returnFormGroups(filterRef(['mostRecentCol', 'majorMinor', 'studentSupportOrgName', 'intendedCollege', 'remediationStatus', 'hsGPA', 'attendingMeetupDay', 'appliedToOtherSupportProgram', 'completedEssay', 'desiredFieldOfStudy', 'satSubjectTests', 'expectedGrad', 'psat', 'lettersOfRecommendation', 'eaEdApplications', 'taxDocumentsSubmitted']));
    const financialHTML = returnFormGroups(filterRef(['startedFafsa', 'completedFafsa', 'completedTap', 'needGap', 'amountOfNeedGap', 'opportunityProgramEligible', 'studentAidReportReceived', 'fsaid', 'scholarshipAmount', 'awardLetterReceived', 'cssProfileCreated']));
    const otherHTML = returnFormGroups(filterRef(['photoReleaseForm', 'cunyApp', 'sunyApp', 'crewAdvisor']));
    const notesHTML = returnFormGroups(filterRef(['riskFactors', 'needsFollowup']));

    return (
      <div id="single-student-page">
        <Form className='single-student-form' onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
          <Row>
            <br/>
            <h2>Biographical Information</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            { bioHTML }
            </div>
            <br/>
            <h2 style={ { clear: 'both', textAlign: 'center' } }>Student Contact</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            { contactHTML }
            </div>
            <br/>
            <h2>Academic Profile</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            { academicHTML }
            </div>
            <br/>
            <h2>Financial Profile</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            { financialHTML }
            </div>
            <br/>
            <h2> Other </h2>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            { otherHTML }
            </div>
            <h2>Student Notes</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            { notesHTML }
            </div>
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


         { this.props.updateStudentStatus.pending ? <div>
                                    <br/>
                                    <p>
                                      Loading
                                    </p><i style={ { fontSize: '50px', textAlign: 'center' } } className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                                  </div> : null }
        { this.props.updateStudentStatus.error ? 
                                  <div>
                                  <br/>
                                  <Alert bsStyle="warning">
                                    <strong>Sorry!</strong> We encountered an error, please check the student form for any errors.
                                  </Alert>
                                  </div>
                                : null }
        { this.props.updateStudentStatus.success ? <div>
                                    <br/>
                                    <Alert bsStyle="success">
                                      <strong>Success!</strong> We updated the student record and everything went swimmingly.
                                    </Alert>
                                    
                                  </div> : null }

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
    studentForm: state.form.SingleStudent,
    updateStudentStatus: state.updateStudent
  };
}

export default connect(
  mapStateToProps, updateStudent
)(SingleStudentForm)





