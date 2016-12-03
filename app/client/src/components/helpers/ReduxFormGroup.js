import React from 'react';
import {Field} from 'redux-form';
import moment from 'moment';

import MenuItem from 'material-ui/MenuItem';
import {RadioButton} from 'material-ui/RadioButton';

import {AutoComplete, Checkbox, RadioButtonGroup, SelectField, Slider, TextField, Toggle} from 'redux-form-material-ui';
import Chips from './Chip';
import DatePicker from './DatePicker';

import {types} from '../../../../server/models/validation/validator';


class ReduxFormGroup extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {disabled, field, initValue} = this.props;
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
                           name={ dbName }
                           component={ SelectField }
                           hintText={ displayName }
                           floatingLabelText={ displayName }>
                        { options }
                    </Field>
                );
            // case 'RadioButtonGroup':

            // case 'AutoComplete':
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

export default ReduxFormGroup;