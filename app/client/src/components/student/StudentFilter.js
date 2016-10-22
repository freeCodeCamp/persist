import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import axios from 'axios';

import { filterStudents } from '../../actions/studentFilter';
import { getSuggestions } from '../../actions/getSuggestions';

import { reduxForm, Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import { SelectField, TextField, AutoComplete } from 'redux-form-material-ui';
import { AutoComplete as MUIAutoComplete } from 'material-ui';

class FilterStudentForm extends React.Component {

  constructor(props) {
    super(props);
  }

  handleFormSubmit(object) {
    console.log(object);
    this.props.filterStudents(object);
  }

  handleUpdateInput(columnName, form, value) {
    form.props.change.bind(form, columnName, value)();
    this.props.getSuggestions(columnName, value);
  }

  render() {
    const {handleSubmit, suggestions} = this.props;
    return (
      <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
        <div>
          <Field name='firstName'
            component={ AutoComplete }
            filter={ MUIAutoComplete.caseInsensitiveFilter }
            dataSource={ suggestions }
            input={ { onUpdateInput: this.handleUpdateInput.bind(this, 'firstName', this), onChange: this.handleUpdateInput.bind(this, 'firstName', this) } }
            floatingLabelText='First Name' />
        </div>
        <div>
          <Field name='lastName' component={ TextField } floatingLabelText='Last Name' />
        </div>
        <div>
          <Field name='gender'
            component={ SelectField }
            hintText='Gender'
            floatingLabelText='Gender'>
            <MenuItem value='M' primaryText='Male' />
            <MenuItem value='F' primaryText='Female' />
          </Field>
        </div>
        <div>
          <RaisedButton type='submit' label='Filter' primary={ true } />
        </div>
      </form>
      );
  }
}

FilterStudentForm = reduxForm({
  form: 'FilterStudent' // a unique name for this form
})(FilterStudentForm);

const mapStateToProps = (state) => {
  return {
    suggestions: state.suggestions
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    filterStudents,
    getSuggestions
  }, dispatch);
};

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(mapStateToProps, mapDispatchToProps)(FilterStudentForm);