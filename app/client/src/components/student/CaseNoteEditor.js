import React, {Component} from 'react';
import {Col, Clearfix} from 'react-bootstrap';
import {reduxForm, Field} from 'redux-form';
import {MenuItem} from 'material-ui';
import isPlainObject from 'lodash/isPlainObject';
import {SelectField, TextField, Toggle} from 'redux-form-material-ui';
import {types} from '../../../../common/validator';

class CaseNoteEditor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {handleSubmit} = this.props;
        let communicationTypes = types['caseNotes.communicationType'];
        if (communicationTypes) {
            communicationTypes = communicationTypes.map((option) => {
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
            communicationTypes.unshift(<MenuItem value={ null } primaryText='None' key='none'/>);
        }
        return (
            <form onSubmit={handleSubmit}>
                <Col style={{minHeight: 100}} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='description'
                        component={ TextField }
                        floatingLabelText='Description'
                        multiLine={ true }
                        rows={ 2 }/>
                </Col>
                <Col style={{minHeight: 100}} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='communicationType'
                        component={SelectField}
                        hintText='Communication Type'
                        floatingLabelText='Communication Type'
                    >
                        { communicationTypes }
                    </Field>
                </Col>
                <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock/>
                <Col style={{minHeight: 100, display: 'flex', alignItems: 'center'}} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='needFollowUp'
                        component={Toggle}
                        label='Needs Follow Up'
                    />
                </Col>
                <Col style={{minHeight: 100, display: 'flex', alignItems: 'center'}} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='issueResolved'
                        component={Toggle}
                        label='Issue Resolved'
                    />
                </Col>
                <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock/>
            </form>
        );
    }
}

const validate = (values) => {
    const errors = {};
    if (!values.description || values.description.length < 1) {
        errors.description = 'Required';
        return errors;
    } else if (!values.communicationType || values.communicationType.length < 1) {
        errors.communicationType = 'Required';
        return errors;
    }
    return errors;
};

CaseNoteEditor = reduxForm({
    form: 'CaseNoteEditor',
    validate
})(CaseNoteEditor);

export default CaseNoteEditor;
