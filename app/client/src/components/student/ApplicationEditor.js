import React, {Component} from 'react';
import {Col, Clearfix} from 'react-bootstrap';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import {ReduxFormGroup} from '../helpers'
import {MenuItem} from 'material-ui';
import isPlainObject from 'lodash/isPlainObject';
import {applicationKeys} from '../../../../common/fieldKeys';
import {SelectField, TextField, Toggle} from 'redux-form-material-ui';
import {types} from '../../../../common/validator';
const styles = {
    error: {
        fontSize: 12,
        marginTop: -4,
        color: 'rgb(244, 67, 54)'
    }
};

class ApplicationEditor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const collegeField = applicationKeys
            .find((key) => key.dbName === 'college');
        const {handleSubmit, initialValues, applicationForm} = this.props;
        let syncErrors = {};
        if (applicationForm['ApplicationEditor']) {
            syncErrors = applicationForm['ApplicationEditor'].syncErrors;
        }
        return (
            <form onSubmit={handleSubmit}>
                <Col style={{minHeight: 100}} xs={12} sm={6} md={6} lg={6}>
                    <ReduxFormGroup
                        form={this}
                        initValue={ initialValues.college }
                        field={ collegeField }
                    />
                    {syncErrors && syncErrors.college ?
                        <div style={styles.error}>{syncErrors.college}</div> :
                        null
                    }
                </Col>
                <Col style={{minHeight: 100}} xs={12} sm={6} md={6} lg={6}>
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
                </Col>
                <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock/>
                <Col style={{minHeight: 100}} xs={12} sm={6} md={6} lg={6}>
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
                </Col>
                <Col style={{minHeight: 100}} xs={12} sm={6} md={6} lg={6}>
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
                </Col>
                <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock/>
                <Col style={{minHeight: 100, display: 'flex', alignItems: 'center'}} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='attending'
                        component={Toggle}
                        label='Attending'
                    />
                </Col>
                <Col style={{minHeight: 100, display: 'flex', alignItems: 'center'}} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='defer'
                        component={Toggle}
                        label='Defer'
                    />
                </Col>
                <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock/>
                <Col style={{minHeight: 100}} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='notes'
                        component={ TextField }
                        floatingLabelText='Notes'
                        multiLine={ true }
                        rows={ 2 }/>
                </Col>
            </form>
        );
    }
}

const validate = (values) => {
    const errors = {};
    if (!values.college || values.college.length < 1) {
        errors.college = 'Required';
        return errors;
    }
    return errors;
};

ApplicationEditor = reduxForm({
    form: 'ApplicationEditor',
    validate
})(ApplicationEditor);

const mapStateToProps = (state) => ({
    applicationForm: state.form
});

export default connect(mapStateToProps)(ApplicationEditor);
