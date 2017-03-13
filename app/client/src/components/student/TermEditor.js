import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field, formValueSelector, SubmissionError} from 'redux-form';
import {Col, Clearfix} from 'react-bootstrap';
import {ReduxFormGroup, DatePicker} from '../helpers'
import {MenuItem} from 'material-ui';
import moment from 'moment';
import keyBy from 'lodash/keyBy';
import isPlainObject from 'lodash/isPlainObject';
import {termKeys} from '../../../../common/fieldKeys';
import {Chip} from '../helpers';
import {SelectField, TextField, Toggle} from 'redux-form-material-ui';
import {types} from '../../../../common/validator';
const termKeysObj = keyBy(termKeys, 'dbName');
const styles = {
    error: {
        fontSize: 12,
        marginTop: -4,
        color: 'rgb(244, 67, 54)'
    }
};

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
                return (<MenuItem value={ option } key={ option } primaryText={ option } />);
            });
            termStatusOptions.unshift(<MenuItem value={ null } primaryText='Unknown if Full or Part-time' key='none' />);
        }
        this.termStatusOptions = termStatusOptions;
        this.graduationTypeOptions =
            ['2 year', '4 year'].map((option) => (<MenuItem value={ option } key={ option } primaryText={ option } />));
    }

    render() {
        const { initialValues, termForm, termName, termStart, termEnd } = this.props;
        let termNamesHTML = [];
        let syncErrors = {};
        if (termStart) {
            const year = new Date(termStart).getFullYear();
            ['Fall ' + year, 'Winter ' + year, 'Spring ' + year, 'Summer ' + year].forEach((name) => {
                termNamesHTML.push(
                    <MenuItem value={ name } primaryText={name} key={name} />
                );
            });
        }
        const nameDisplay = termStart &&
        termEnd &&
        (!termName || termName.length < 1) ? 'block' : 'none';
        if (termForm['TermEditor']) {
            syncErrors = termForm['TermEditor'].syncErrors;
        }
        return (
            <form>
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <ReduxFormGroup
                        form={this}
                        initValue={ initialValues.college }
                        field={ termKeysObj.college }
                    />
                    {syncErrors && syncErrors.college ?
                        <div style={styles.error}>{syncErrors.college}</div> :
                        null
                    }
                </Col>
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <ReduxFormGroup
                        form={this}
                        initValue={ initialValues.enrolBegin }
                        field={ termKeysObj.enrolBegin }
                    />
                </Col>
                <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock />
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='enrolEnd'
                        hintText='Enrollment End'
                        floatingLabelText='Enrollment End'
                        container='inline'
                        locale='en-US'
                        component={ DatePicker }
                    />
                </Col>
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='status'
                        component={SelectField}
                        hintText='Status'
                        floatingLabelText='Status'
                    >
                        {this.termStatusOptions}
                    </Field>
                </Col>
                <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock />
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='creditsEarned'
                        component={ TextField }
                        floatingLabelText='Credits Earned'
                    />
                </Col>
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='creditsAttempted'
                        component={ TextField }
                        floatingLabelText='Credits Attempted'
                    />
                </Col>
                <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock />
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='gpa'
                        component={ TextField }
                        floatingLabelText='Term GPA'
                    />
                </Col>
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='degreeTitle'
                        component={ Chip }
                        hintText='Degree Earned'
                        floatingLabelText='Degree Earned'
                        form={this}
                        options={ types['terms.degreeTitle']}
                        initValue={initialValues.degreeTitle}
                        field={termKeysObj['degreeTitle']}
                    />
                </Col>
                <Clearfix visibleSmBlock visibleMdBlock visibleLgBlock />
                <Col style={{ minHeight: 100, display: nameDisplay }} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='name'
                        component={SelectField}
                        hintText='Name'
                        floatingLabelText='Name'
                    >
                        {termNamesHTML}
                    </Field>
                </Col>
                <Col style={{ minHeight: 100 }} xs={12} sm={6} md={6} lg={6}>
                    <Field
                        name='graduationType'
                        component={SelectField}
                        hintText='Graduation Type'
                        floatingLabelText='Graduation Type'
                    >
                        {this.graduationTypeOptions}
                    </Field>
                </Col>
            </form>
        );
    }
}

const validate = (values, props) => {
    const errors = {};
    const enrolBegin = values.enrolBegin;
    const enrolEnd = values.enrolEnd;
    if (!values.college || values.college.length < 1) {
        errors.college = 'Required';
        return errors;
    } else if (!enrolBegin) {
        errors.enrolBegin = 'Required';
        return errors;
    } else if (!enrolEnd) {
        errors.enrolEnd = 'Required';
        return errors;
    }
    const year = new Date(enrolBegin).getFullYear();
    if (moment(enrolBegin).diff(moment([year, 7, 10]), 'days') > 0 && moment([year, 11, 31]).diff(moment(enrolEnd), 'days') > 0) {
        props.dispatch(props.change('name', 'Fall ' + year));
    } else if (moment(enrolBegin).diff(moment([year, 11, 1]), 'days') > 0 && moment([year + 1, 2, 1]).diff(moment(enrolEnd), 'days') > 0) {
        props.dispatch(props.change('name', 'Winter ' + year));
    } else if (moment(enrolBegin).diff(moment([year, 0, 1]), 'days') > 0 && moment(enrolEnd).diff(moment([year, 3, 1]), 'days') > 0 &&
        moment([year, 5, 30]).diff(moment(enrolEnd), 'days') > 0) {
        props.dispatch(props.change('name', 'Spring ' + year));
    } else if (moment(enrolBegin).diff(moment([year, 4, 1]), 'days') > 0 && moment([year, 7, 30]).diff(moment(enrolEnd), 'days') > 0) {
        props.dispatch(props.change('name', 'Summer ' + year));
    } else {
        props.dispatch(props.change('name', null));
        errors.name = 'Required';
    }
    return errors;
};

TermEditor = reduxForm({
    form: 'TermEditor',
    validate
})(TermEditor);

const selector = formValueSelector('TermEditor');
const mapStateToProps = (state) => ({
    termStart: selector(state, 'enrolBegin'),
    termEnd: selector(state, 'enrolEnd'),
    termName: selector(state, 'name'),
    termForm: state.form
});

export default connect(mapStateToProps)(TermEditor);
