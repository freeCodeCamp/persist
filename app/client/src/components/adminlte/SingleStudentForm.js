import React from 'react';
import { Field, reduxForm } from 'redux-form';
import  { connect } from 'react-redux';

import { Button, Form, FormGroup, Label, Input, Container, InputGroup } from 'reactstrap';
import * as actions from '../../actions';

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
        this.setState({editable: !this.state.editable})
    }

    toggleEdit() {
        this.setState({editable: !this.state.editable})
    }
    
    render() {
        const { firstName, lastName, hsGradYear, schoolAccName } = this.props.student;
        const { handleSubmit, reset } = this.props;
        //const { handleSubmit, load, pristine, reset, submitting } = props
        return (
            <Form className='single-student-form' onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
              
                <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Field className="form-control" disabled={!this.state.editable} name="firstName" component="input" type="text"/>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Field className="form-control" disabled={!this.state.editable} name="lastName" component="input" type="text"/>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="email">High School Grad Year</Label>
                    <Field className="form-control" disabled={!this.state.editable} name="hsGradYear" component="input" type="text"/>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="email">School Acc Name</Label>
                    <Field className="form-control" disabled={!this.state.editable} name="schoolAccName" component="input" type="text"/>
                </FormGroup>
                
                { this.state.editable ? <div>
                                            <Button type="submit">Submit</Button>
                                            <Button type="button" onClick={reset}>Undo Changes</Button>
                                        </div> : <Button type="button" onClick={() => this.toggleEdit()}>Edit</Button>
                }
                
                
            </Form>

        	);
    }
}

SingleStudentForm = reduxForm({
  form: 'SingleStudent' // a unique name for this form
})(SingleStudentForm);

function mapStateToProps(state) {
  return { studentForm: state.form };
}

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(
  mapStateToProps, actions
)(SingleStudentForm)





