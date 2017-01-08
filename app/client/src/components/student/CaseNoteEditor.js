import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {MenuItem} from 'material-ui';
import {SelectField, TextField, Toggle} from 'redux-form-material-ui';
import {types} from '../../../../common/validator';

class CaseNoteEditor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {handleSubmit, initialValues} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Field
                    name='description'
                    component={ TextField }
                    floatingLabelText='Description'
                    multiLine={ true }
                    rows={ 2 }/>
                <Field
                    name='communicationType'
                    component={SelectField}
                    hintText='Communication Type'
                    floatingLabelText='Communication Type'
                />
                <Field
                    name='needFollowUp'
                    component={Toggle}
                    label='Needs Follow Up'
                />
                <Field
                    name='issueResolved'
                    component={Toggle}
                    label='Issue Resolved'
                />
            </form>
        );
    }
}

CaseNoteEditor = reduxForm({
    form: 'CaseNoteEditor'
})(CaseNoteEditor);

export default CaseNoteEditor;
