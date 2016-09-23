import React from 'react';
import { Field, reduxForm } from 'redux-form';
import  { connect } from 'react-redux';

import { Button, Form, Label, Input, Container, InputGroup, Row, FormGroup } from 'reactstrap';

import * as studentFilter from '../../../actions/studentFilter';


class FilterStudentForm extends React.Component {
    constructor(props) {
        super(props);
        
    }

    handleFormSubmit(object) {

        this.props.filterStudents(object);
        
    }
    
    render() {
       
        const { handleSubmit, reset } = this.props;

        return (

                <Form id='student-filter' onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                    Filter
                    <FormGroup>
                        <Label htmlFor='lastName'>Last Name</Label>
                        <Field className='form-control' name='lastName' component='input' type='text'/>
                        <Label htmlFor='firstName'>First Name</Label>
                        <Field className='form-control' name='firstName' component='input' type='text'/>
                        <Button type='submit'>Submit</Button>
                    </FormGroup>
                </Form>
              
            );
    }
}

FilterStudentForm = reduxForm({
  form: 'FilterStudent' // a unique name for this form
})(FilterStudentForm);

/*
function mapStateToProps(state) {
  return { filteredStudents: state.filteredStudents };
}
*/

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(
  null, studentFilter
)(FilterStudentForm)





