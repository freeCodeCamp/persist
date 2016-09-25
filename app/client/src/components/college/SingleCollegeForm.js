import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { Button, Form, Label, Input, Container, InputGroup, Row } from 'react-bootstrap';



import FormGroup from '../helpers/ReduxFormGroup';

import keys from '../../../../server/helpers/collegeKeys';

class SingleCollegeForm extends React.Component {
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
    })
  }

  render() {

    const {handleSubmit, reset} = this.props;

    var inputHTML = Object.keys(keys).map((key, i) => {
      return (
        <div className="col-md-6 col-sm-4 col-lg-4" key={ i }>
          <FormGroup disabled={ this.state.editable } name={ keys[key] }>
            { key }
          </FormGroup>
        </div>
      )
    });

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

SingleCollegeForm = reduxForm({
  form: 'SingleCollege' // a unique name for this form
})(SingleCollegeForm);

function mapStateToProps(state) {
  return {
    collegeForm: state.form
  };
}

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(
  mapStateToProps
)(SingleCollegeForm)





