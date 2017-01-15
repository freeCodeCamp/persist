import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {ReduxFormGroup} from '../helpers'
import {MenuItem} from 'material-ui';
import isPlainObject from 'lodash/isPlainObject';
import {termKeys} from '../../../../common/fieldKeys';

class TermEditor extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let termStatusOptions = types['terms.status'];
        if (termStatusOptions) {
            termStatusOptions = termStatusOptions.map((option) => {
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
            termStatusOptions.unshift(<MenuItem value={ null } primaryText='Unknown if Full or Part-time' key='none'/>);
        }
        this.termStatusOptions = termStatusOptions;
    }

    render() {
        const collegeField = termKeys
            .find((key) => key.dbName === 'college');
        const {handleSubmit, initialValues} = this.props;
        console.log(initialValues.college);
        return (
            <form onSubmit={handleSubmit}>
                <ReduxFormGroup
                    form={this}
                    initValue={ initialValues.college }
                    field={ collegeField }
                />
                <Field
                    name='name'
                    component={SelectField}
                    hintText='Name'
                    floatingLabelText='Name'
                >
                </Field>
                <Field
                    name='status'
                    component={SelectField}
                    hintText='Status'
                    floatingLabelText='Status'
                >
                    {this.termStatusOptions}
                </Field>
                <Field
                    name='creditsEarned'
                    component={ TextField }
                    floatingLabelText='Credits Earned'
                />
                <Field
                    name='creditsAttempted'
                    component={ TextField }
                    floatingLabelText='Credits Attempted'
                />
                <Field
                    name='gpa'
                    component={ TextField }
                    floatingLabelText='Term GPA'
                />
            </form>
        );
    }
}

TermEditor = reduxForm({
    form: 'TermEditor'
})(TermEditor);

export default TermEditor;
