import React from 'react';
import {Field} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {AutoComplete, Checkbox, SelectField, TextField, Toggle} from 'redux-form-material-ui';
import Chips from './Chip';
import ChipsAdd from './ChipAdd';
import {connect} from 'react-redux';
import {AutoComplete as MUIAutoComplete} from 'material-ui';
import DatePicker from './DatePicker';
import isPlainObject from 'lodash/isPlainObject';
import {types} from '../../../../common/validator';

class ReduxFormGroup extends React.Component {

    constructor(props) {
        super(props);
    }

    updateInput(value, columnName) {
        const {form} = this.props;
        if (value) {
            form.props.change.bind(form, columnName, value)();
        }
    }

    checkEmpty(value, columnName, nullValue) {
        if (!isPlainObject(value) && value.length === 0 && nullValue) {
            const {form} = this.props;
            form.props.change.bind(form, columnName, null)();
        }
    }

    initCollege(colId) {
        const {collegeObj} = this.props;
        if (colId && collegeObj[colId]) {
            return collegeObj[colId].fullName || '';
        }
        return '';
    }

    initSchool(school) {
        const {schoolObj} = this.props;
        if (school && schoolObj[school]) {
            return schoolObj[school].name || '';
        }
        return '';
    }

    render() {
        const {disabled, field, form, initValue, collegeSource, schoolSource} = this.props;
        const {fieldType, dbName, displayName} = field;

        switch (fieldType) {

            case 'TextField':
                return (
                    <Field disabled={ disabled }
                           name={ dbName.toString() }
                           component={ TextField }
                           floatingLabelText={ displayName }/>
                );
            case 'TextBox':
                return (
                    <Field disabled={ disabled }
                           name={ dbName.toString() }
                           component={ TextField }
                           floatingLabelText={ displayName }
                           multiLine={ true }
                           rows={ 2 }/>
                );
            case 'DatePicker':
                return (
                    <Field disabled={ disabled }
                           name={ dbName }
                           hintText={ displayName }
                           floatingLabelText={ displayName }
                           container='inline'
                           component={ DatePicker }/>
                );
            case 'Checkbox':
                return (
                    <Field disabled={ disabled }
                           name={ dbName }
                           form={ form }
                           options={ types[dbName] || [] }
                           initValue={ initValue }
                           component={ Chips }
                           field={ field }/>
                );
            case 'Checkbox_Add':
                return (
                    <Field
                        disabled={disabled}
                        name={dbName}
                        form={form}
                        initValue={initValue}
                        component={ChipsAdd}
                        field={field}
                    />
                );
            case 'Toggle':
                return (
                    <Field style={ {width: 'auto', margin: '20px'} }
                           disabled={ disabled }
                           name={ dbName.toString() }
                           component={ Toggle }
                           label={ displayName }/>
                );
            case 'SelectField':
                let options = types[dbName];
                if (options) {
                    options = options.map((option) => {
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
                    options.unshift(<MenuItem value={ null } primaryText='None' key='none'/>);
                }
                return (
                    <Field disabled={ disabled }
                           name={ dbName.toString() }
                           component={ SelectField }
                           hintText={ displayName }
                           floatingLabelText={ displayName }>
                        { options }
                    </Field>
                );
            // case 'RadioButtonGroup':

            case 'AutoComplete':
                const {nullAllowed} = this.props;
                switch (field.type) {
                    case 'college':
                        return (
                            <MUIAutoComplete
                                floatingLabelText={ displayName }
                                disabled={disabled}
                                filter={MUIAutoComplete.caseInsensitiveFilter}
                                name={dbName.toString()}
                                searchText={this.initCollege(initValue)}
                                onUpdateInput={(v) => this.checkEmpty(v, dbName.toString(), nullAllowed)}
                                onNewRequest={(v) => this.updateInput(v.value, dbName.toString())}
                                dataSource={collegeSource}
                                maxSearchResults={5}
                            />
                        );
                    case 'school':
                        return (
                            <MUIAutoComplete
                                name={dbName.toString()}
                                hintText={displayName}
                                floatingLabelText={displayName}
                                filter={ MUIAutoComplete.caseInsensitiveFilter }
                                disabled={disabled}
                                searchText={this.initSchool(initValue)}
                                onUpdateInput={(v) => this.checkEmpty(v, dbName.toString(), nullAllowed)}
                                onNewRequest={(v) => this.updateInput(v.value, dbName.toString())}
                                dataSource={schoolSource}
                                maxSearchResults={5}
                            />
                        );
                }
            default:
                return (
                    <Field disabled={ disabled }
                           name={ dbName.toString() }
                           component={ TextField }
                           floatingLabelText={ displayName }/>
                );
        }
    }
}

const mapStateToProps = (state) => ({
    collegeSource: state.colleges.collegeSource,
    collegeObj: state.colleges.idObj,
    schoolSource: state.schools.schoolSource,
    schoolObj: state.schools.idObj
});

export default connect(mapStateToProps)(ReduxFormGroup);
