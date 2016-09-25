import React from 'react';
import { Field } from 'redux-form';
import { TextField } from 'redux-form-material-ui';

class ReduxFormGroup extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Field disabled={ !this.props.disabled }
        name={ this.props.name }
        component={ TextField }
        floatingLabelText={ this.props.name } />
      );
  }
}

export default ReduxFormGroup;