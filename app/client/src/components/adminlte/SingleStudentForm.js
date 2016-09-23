import React from 'react';
import { Field, reduxForm } from 'redux-form';
import  { connect } from 'react-redux';

import { Button, Form, Label, Input, Container, InputGroup, Row } from 'reactstrap';
import * as actions from '../../actions';
import FormGroup from './ReduxFormGroup';
import keys from './helpers/key';

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

        const exceptions=[]

        var inputHTML = Object.keys(keys).map((key, i) => {
            // if (exceptions.include(key)) {
            //     return null;
            // }
            return (
                <div className="col-md-6 col-sm-4 col-lg-4" key={i}>
                    <FormGroup  disabled={this.state.editable} name={keys[key]}>{key}</FormGroup>
                </div>
            )
        });

        
        return (
            <Form className='single-student-form' onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                <Row>
                    {inputHTML}
                </Row>
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





