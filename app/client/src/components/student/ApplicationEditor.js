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

    componentWillMount() {
        let resultOptions = types['applications.result'];
        let typeOptions = types['applications.type'];
        let heopOptions = types['applications.heop'];
        if (resultOptions) {
            resultOptions = resultOptions.map((option) => {
                if (isPlainObject(option)) {
                    return (
                        <MenuItem
                            value={option.value}
                            key={option.value}
                            primaryText={option.text}
                        />
                    )
                }
                return (<MenuItem value={ option } key={ option } primaryText={ option }/>);
            });
            resultOptions.unshift(<MenuItem value={ null } primaryText='None' key='none'/>);
        }
        if (typeOptions) {
            typeOptions = typeOptions.map((option) => {
                if (isPlainObject(option)) {
                    return (
                        <MenuItem
                            value={option.value}
                            key={option.value}
                            primaryText={option.text}
                        />
                    )
                }
                return (<MenuItem value={ option } key={ option } primaryText={ option }/>);
            });
            typeOptions.unshift(<MenuItem value={ null } primaryText='None' key='none'/>);
        }
        if (heopOptions) {
            heopOptions = heopOptions.map((option) => {
                if (isPlainObject(option)) {
                    return (
                        <MenuItem
                            value={option.value}
                            key={option.value}
                            primaryText={option.text}
                        />
                    )
                }
                return (<MenuItem value={ option } key={ option } primaryText={ option }/>);
            });
            heopOptions.unshift(<MenuItem value={ null } primaryText='None' key='none'/>);
        }
        this.resultOptions = resultOptions;
        this.typeOptions = typeOptions;
        this.heopOptions = heopOptions;
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
                    { this.typeOptions }
                </Field>
                <Field
                    name='result'
                    component={SelectField}
                    hintText='Result'
                    floatingLabelText='Result'
                >
                    { this.resultOptions }
                </Field>
                <Field
                    name='heop'
                    component={SelectField}
                    hintText='HEOP/EOP'
                    floatingLabelText='HEOP/EOP'
                >
                    { this.heopOptions }
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
