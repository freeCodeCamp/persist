import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { Button, Form, Row } from 'react-bootstrap';

import FormGroup from '../helpers/ReduxFormGroup';
import CollegeSummary from '../college/CollegeSummary';
import CollegeTermRecords from '../college/CollegeTermRecords';

import keys from '../../../../server/helpers/key';

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
    })
  }

  toggleEdit() {
    this.setState({
      editable: !this.state.editable
    })
  }

  render() {

    const {handleSubmit, reset} = this.props;

    const exceptions = []

    var inputHTML = Object.keys(keys).map((key, i) => {
      // if (exceptions.include(key)) {
      //     return null;
      // }
      return (
        <div className="col-md-6 col-sm-4 col-lg-4" key={ i }>
          <FormGroup disabled={ this.state.editable } name={ keys[key] }>
            { key }
          </FormGroup>
        </div>
      )
    });

    const {hsGPA, majorMinor, transferStatus} = this.props.student;

    const collegeSummary = {
      recentCollege: 'TEST DATA',
      hsGPA: hsGPA,
      studentSupport: 'TEST DATA',
      majorMinor: majorMinor,
      remediation: 'TEST DATA',
      transferStatus: transferStatus
    }


    return (
      <div id="single-student-page">
        <CollegeSummary summary={ collegeSummary } />
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
        <CollegeTermRecords terms={ this.props.student.terms } />
      </div>

      );
  }
}

SingleStudentForm = reduxForm({
  form: 'SingleStudent' // a unique name for this form
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





