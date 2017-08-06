import React, { Component } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { MenuItem } from 'material-ui';
import { ROLE_COUNSELOR, ROLE_OWNER } from '../../../../common/constants';
import set from 'lodash/set';
import get from 'lodash/get';
import { SelectField, TextField, AutoComplete } from 'redux-form-material-ui';

class UserEditor extends Component {
    constructor(props) {
        super(props);
    }

    updateInput(columnName, form, { value }) {
        if (value) {
            form.props.change.bind(form, columnName, value)();
        }
    }

    initValue(school) {
        const { schoolObj } = this.props;
        if (school && schoolObj[school]) {
            return schoolObj[school].name || '';
        }
        return '';
    }

    render() {
        const { roleValue, handleSubmit, initialValues, schoolSource } = this.props;
        const access = initialValues.access;
        const roles = [ROLE_COUNSELOR, ROLE_OWNER].map(option => <MenuItem value={option} key={option} primaryText={option} />);
        return (
            <form onSubmit={handleSubmit} style={{display: 'flex', flexWrap: 'wrap'}}>
                <Field name='profile.firstName' component={TextField} hintText='First Name' floatingLabelText='First Name' /><br />
                <Field name='profile.lastName' component={TextField} hintText='Last Name' floatingLabelText='Last Name' /><br />
                <Field name='email' component={TextField} hintText='Email' floatingLabelText='Email' /><br />
                <Field name='access.role' component={SelectField} hintText='Role' floatingLabelText='Role'>
                    {roles}
                </Field><br />
                {roleValue === 'Counselor'
                    ? <Field
                          name='access.school'
                          hintText='School'
                          floatingLabelText='School'
                          component={AutoComplete}
                          searchText={this.initValue(access ? access.school : '')}
                          input={{
                              onChange: this.updateInput.bind(this, 'access.school', this)
                          }}
                          dataSource={schoolSource}
                          maxSearchResults={5}
                      />
                    : null}
            </form>
        );
    }
}

const validate = (values, props) => {
    const errors = {};
    if (!get(values, 'profile.firstName')) {
        set(errors, 'profile.firstName', 'Required');
    }
    if (!values.email) {
        errors.email = 'Required';
    } else {
        const emails = props.users.map(u => u.email);
        if (emails.includes(values.email)) {
            errors.email = 'Already invited';
        }
    }
    if (!get(values, 'access.role')) {
        set(errors, 'access.role', 'Required');
    } else if (get(values, 'access.role') === ROLE_COUNSELOR && !get(values, 'access.school')) {
        set(errors, 'access.school', 'Required');
    }
    return errors;
};

UserEditor = reduxForm({
    form: 'UserEditor',
    validate
})(UserEditor);

const selector = formValueSelector('UserEditor');
const mapStateToProps = state => ({
    users: state.users.value,
    schoolSource: state.schools.schoolSource,
    schoolObj: state.schools.idObj,
    roleValue: selector(state, 'access.role')
});

export default connect(mapStateToProps)(UserEditor);
