import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';

import {Button, Form, Label, Input, Container, InputGroup, Row, Alert} from 'react-bootstrap';

import FormGroup from '../helpers/ReduxFormGroup';

import * as updateCollege from '../../actions/updateCollege';

import {collegeKeys} from '../../../../common/fieldKeys';

class SingleCollegeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editable: false
        };

    }

    handleFormSubmit(collegeRecord) {
        //this will handle updates
        console.log('this is our form object', collegeRecord);
        this.props.updateCollege(collegeRecord);
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

        const returnFormGroups = (collegeKeys) => {

            // initial value var
            let initialValue;

            return collegeKeys.map((field, i) => {


                let editable = this.state.editable;

                initialValue = this.props.initialValues[field.dbName];
                if (!field.hidden) {
                    return (
                        <FormGroup style={{margin: '50px', textAlign: 'center'}} initValue={ initialValue } key={i}
                                   disabled={ editable } field={ field }>
                            { field.dbName }
                        </FormGroup>
                    );

                }

            });
        };

        const allFields = returnFormGroups(collegeKeys);

        return (
            <div id="single-college-page">
                <Form className='single-student-form' onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                        { allFields }
                    </div>
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

                    { this.props.updateCollegeStatus.pending ? <div>
                        <br/>
                        <p>
                            Loading
                        </p><i style={ {fontSize: '50px', textAlign: 'center'} }
                               className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                    </div> : null }
                    { this.props.updateCollegeStatus.error ?
                        <div>
                            <br/>
                            <Alert bsStyle="warning">
                                <strong>Sorry!</strong> We encountered an error, please check the student form for any
                                errors.
                            </Alert>
                        </div>
                        : null }
                    { this.props.updateCollegeStatus.success ? <div>
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

SingleCollegeForm = reduxForm({
    form: 'SingleCollege' // a unique name for this form
})(SingleCollegeForm);

function mapStateToProps(state) {
    return {
        collegeForm: state.form,
        updateCollegeStatus: state.updateCollege
    };
}

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(
    mapStateToProps, updateCollege
)(SingleCollegeForm)





