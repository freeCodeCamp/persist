import React, { Component } from 'react';
import { Col, Clearfix } from 'react-bootstrap';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { ReduxFormGroup } from '../helpers';
import keyBy from 'lodash/keyBy';
import { MenuItem } from 'material-ui';
import isPlainObject from 'lodash/isPlainObject';
import { aliasKeys } from '../../../../common/fieldKeys';
import { SelectField, TextField, Toggle } from 'redux-form-material-ui';
const aliasKeysObj = keyBy(aliasKeys, 'dbName');
const styles = {
    error: {
        fontSize: 12,
        marginTop: -4,
        color: 'rgb(244, 67, 54)'
    }
};

class AliasEditor extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { handleSubmit, initialValues } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <ReduxFormGroup form={this} initValue={initialValues.firstName} field={aliasKeysObj.firstName} />
                </Col>
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <ReduxFormGroup form={this} initValue={initialValues.middleName} field={aliasKeysObj.middleName} />
                </Col>
                <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock />
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <ReduxFormGroup form={this} initValue={initialValues.lastName} field={aliasKeysObj.lastName} />
                </Col>
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <ReduxFormGroup form={this} initValue={initialValues.suffix} field={aliasKeysObj.suffix} />
                </Col>
            </form>
        );
    }
}

AliasEditor = reduxForm({
    form: 'AliasEditor'
})(AliasEditor);

export default AliasEditor;
