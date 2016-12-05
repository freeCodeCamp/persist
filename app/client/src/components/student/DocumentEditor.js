import React, { Component } from 'react';
import {reduxForm, Field} from 'redux-form';
import {SelectField} from 'redux-form-material-ui';

class DocumentEditor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form>
                <Field
                    name='type'
                    component={SelectField}
                />
            </form>
        );
    }
}

DocumentEditor = reduxForm({
    form: 'DocumentEditor'
});

export default DocumentEditor;
