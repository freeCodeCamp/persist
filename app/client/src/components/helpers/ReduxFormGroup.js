import React from 'react';
import {Field} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import {AutoComplete, Checkbox, SelectField, TextField, Toggle} from 'redux-form-material-ui';
import Chips from './Chip';
import {connect} from 'react-redux';
import {AutoComplete as MUIAutoComplete} from 'material-ui';
import DatePicker from './DatePicker';

import {types} from '../../../../server/models/validation/validator';

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

    initCollege(colId) {
        const {collegeObj} = this.props;
        if (colId) {
            return collegeObj[colId].fullName || '';
        }
        return '';
    }

    render() {
        const {disabled, field, initValue, collegeSource} = this.props;
        const {fieldType, dbName, displayName} = field;

        switch (fieldType) {

            case 'TextField':
                return (
                    <Field disabled={ disabled }
                           name={ dbName.toString() }
                           component={ TextField }
                           floatingLabelText={ displayName }/>
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
                           options={ types[dbName] }
                           initValue={ initValue }
                           component={ Chips }
                           field={ field }/>
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
                if (field.type === 'college') {
                    return (
                        <MUIAutoComplete
                            floatingLabelText={ displayName }
                            disabled={disabled}
                            filter={MUIAutoComplete.caseInsensitiveFilter}
                            name={dbName.toString()}
                            searchText={this.initCollege(initValue)}
                            onNewRequest={(v) => this.updateInput(v.value, dbName.toString())}
                            dataSource={collegeSource}
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
    collegeObj: state.colleges.idObj
});

export default connect(mapStateToProps)(ReduxFormGroup);