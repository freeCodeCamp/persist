import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {ReduxFormGroup} from '../helpers'
import {MenuItem} from 'material-ui';
import isPlainObject from 'lodash/isPlainObject';
import {applicationKeys} from '../../../../common/fieldKeys';
import {SelectField, TextField, Toggle} from 'redux-form-material-ui';
import {types} from '../../../../common/validator';

class ApplicationEditor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const collegeField = applicationKeys
            .find((key) => key.dbName === 'college');
        const {handleSubmit, initialValues} = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <ReduxFormGroup
                    form={this}
                    initValue={ initialValues.college }
                    field={ collegeField }
                />
                <Field
                    name='type'
                    component={SelectField}
                    hintText='Type'
                    floatingLabelText='Type'
                >
                    {types['applications.type'].map((option, i) => (
                        <MenuItem value={option} key={i} primaryText={option}/>
                    ))}
                </Field>
                <Field
                    name='result'
                    component={SelectField}
                    hintText='Result'
                    floatingLabelText='Result'
                >
                    {types['applications.result'].map((option, i) => (
                        <MenuItem value={option} key={i} primaryText={option}/>
                    ))}
                </Field>
                <Field
                    name='heop'
                    component={SelectField}
                    hintText='HEOP/EOP'
                    floatingLabelText='HEOP/EOP'
                >
                    {types['applications.heop'].map((option, i) => (
                        <MenuItem value={option} key={i} primaryText={option}/>
                    ))}
                </Field>
                <Field
                    name='attending'
                    component={Toggle}
                    label='Attending'
                />
                <Field
                    name='defer'
                    component={Toggle}
                    label='Defer'
                />
                <Field
                    name='notes'
                    component={ TextField }
                    floatingLabelText='Notes'
                    multiLine={ true }
                    rows={ 2 }/>
            </form>
        );
    }
}

ApplicationEditor = reduxForm({
    form: 'ApplicationEditor'
})(ApplicationEditor);

export default ApplicationEditor;
