import React from 'react';
import { Field } from 'redux-form';

import MenuItem from 'material-ui/MenuItem';
import { RadioButton } from 'material-ui/RadioButton';

import { AutoComplete, Checkbox, DatePicker, RadioButtonGroup, SelectField, Slider, TextField, Toggle } from 'redux-form-material-ui';
import Chips from './Chip';

import { types } from '../../../../server/models/validation/validator';


class ReduxFormGroup extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {fieldType} = this.props.field;

    switch (fieldType) {

      case 'TextField':
        return (
          <Field disabled={ !this.props.disabled }
            name={ this.props.field.dbName.toString() }
            component={ TextField }
            floatingLabelText={ this.props.field.displayName } />
          );

      case 'DatePicker':
        return (
          <Field name={ this.props.field.dbName }
            hintText={ this.props.field.displayName }
            container='inline'
            component={ DatePicker } />
          );
      case 'Checkbox':
        return (
          <Field name={ this.props.field.dbName }
            initValue={ this.props.initValue }
            component={ Chips }
            field={ this.props.field } />
          );
      case 'Toggle':
        return (
          <Field disabled={ !this.props.disabled }
            name={ this.props.field.dbName.toString() }
            component={ Toggle }
            label={ this.props.field.displayName } />
          );
      case 'SelectField':

        let options = types[this.props.field.dbName];
        if (options) {
          options = options.map((option, i) => {
            return <MenuItem value={ option } key={ option } primaryText={ option } />
          });
        }
        return (
          <Field name={ this.props.field.dbName } component={ SelectField } floatingLabelText={ this.props.field.displayName }>
            { options }
          </Field>
        )
        // case 'RadioButtonGroup':

      // case 'AutoComplete':
      default:
        return (
          <Field disabled={ !this.props.disabled }
            name={ this.props.field.dbName.toString() }
            component={ TextField }
            floatingLabelText={ this.props.field.displayName } />
          );

    }







  }
}

export default ReduxFormGroup;