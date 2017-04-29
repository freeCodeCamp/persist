import React, { Component } from 'react';
import { Col, Clearfix } from 'react-bootstrap';
import { reduxForm, Field } from 'redux-form';
import { MenuItem } from 'material-ui';
import { FileInput } from '../utils';
import { SelectField, TextField } from 'redux-form-material-ui';
import { types } from '../../../../common/validator';

class DocumentEditor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { handleSubmit, initialValues } = this.props;
        const documentTypes = types['documents.types'].map(option => <MenuItem value={option} key={option} primaryText={option} />);
        return (
            <form onSubmit={handleSubmit}>
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <Field name="name" component={TextField} hintText="Name" floatingLabelText="Name" />
                </Col>
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <Field name="type" component={SelectField} hintText="Type" floatingLabelText="Type">
                        {documentTypes}
                    </Field>
                </Col>
                <Col style={{ minHeight: 100, display: 'flex', alignItems: 'center' }} xs={12} sm={12} md={12} lg={12}>
                    <Field
                        type="file"
                        Key={initialValues.Key}
                        fileLink={initialValues.downloadLink}
                        name="document"
                        component={FileInput}
                    />
                </Col>
            </form>
        );
    }
}

DocumentEditor = reduxForm({
    form: 'DocumentEditor'
})(DocumentEditor);

export default DocumentEditor;
