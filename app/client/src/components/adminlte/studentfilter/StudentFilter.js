import React from 'react';
import { Field, reduxForm } from 'redux-form';
import  { connect } from 'react-redux';

import { Button, Form, Label, Input, Container, InputGroup, Row, FormGroup } from 'reactstrap';

import * as studentFilter from '../../../actions/studentFilter';

import MenuItem from 'material-ui/MenuItem'
import { RadioButton } from 'material-ui/RadioButton'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()
import {
  Checkbox,
  RadioButtonGroup,
  SelectField,
  TextField,
  Toggle,
  Slider
} from 'redux-form-material-ui'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
 
class FilterStudentForm extends React.Component {


    handleFormSubmit(object) {

        this.props.filterStudents(object);
        
    }

  render() {

    const { handleSubmit, reset } = this.props;

    return (
    <MuiThemeProvider>
      <Form id='college-filter' onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <Field name="firstName" component={TextField} hintText="First Name"/>
        <Field name="lastName" component={TextField} hintText="Last Name"/>
        
        <Field name="gender" component={SelectField} hintText="Gender">
          <MenuItem value="M" primaryText="M"/>
          <MenuItem value="F" primaryText="F"/>
        </Field>
        
        <Field name="agreeToTerms" component={Checkbox} label="Agree to terms?"/>
        
        <Field name="receiveEmails" component={Toggle} label="Please spam me!"/>
        
        <Field name="bestFramework" component={RadioButtonGroup}>
          <RadioButton value="react" label="React"/>
          <RadioButton value="angular" label="Angular"/>
          <RadioButton value="ember" label="Ember"/>
        </Field>
        <Field name="hsGPA" component={Slider} min={0} max={15} value={7}>
        </Field>
        <Button type='submit'>Submit</Button>
      </Form>
      </MuiThemeProvider>
    )
  }
}

FilterStudentForm = reduxForm({
  form: 'FilterStudent' // a unique name for this form
})(FilterStudentForm);

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(
  null, studentFilter
)(FilterStudentForm)

// import React from 'react'
// import { reduxForm, Field } from 'redux-form'
// import MenuItem from 'material-ui/MenuItem'
// import { RadioButton } from 'material-ui/RadioButton'
// import injectTapEventPlugin from 'react-tap-event-plugin'
// injectTapEventPlugin()
// import {
//   Checkbox,
//   RadioButtonGroup,
//   SelectField,
//   TextField,
//   Toggle
// } from 'redux-form-material-ui'
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
 
// class MyForm extends React.Component {
//   render() {
//     return (
//     <MuiThemeProvider>
//       <form>
//         <Field name="username" component={TextField} hintText="Street"/>
        
//         <Field name="plan" component={SelectField} hintText="Select a plan">
//           <MenuItem value="monthly" primaryText="Monthly"/>
//           <MenuItem value="yearly" primaryText="Yearly"/>
//           <MenuItem value="lifetime" primaryText="Lifetime"/>
//         </Field>
        
//         <Field name="agreeToTerms" component={Checkbox} label="Agree to terms?"/>
        
//         <Field name="receiveEmails" component={Toggle} label="Please spam me!"/>
        
//         <Field name="bestFramework" component={RadioButtonGroup}>
//           <RadioButton value="react" label="React"/>
//           <RadioButton value="angular" label="Angular"/>
//           <RadioButton value="ember" label="Ember"/>
//         </Field>
//       </form>
//       </MuiThemeProvider>
//     )
//   }
// }
 
// // Decorate with redux-form 
// MyForm = reduxForm({
//   form: 'myForm'
// })(MyForm)
 
// export default MyForm

// import React from 'react'
// import { Field, reduxForm } from 'redux-form'
// import TextField from 'material-ui/TextField'
// import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
// import Checkbox from 'material-ui/Checkbox'
// import SelectField from 'material-ui/SelectField'
// import MenuItem from 'material-ui/MenuItem'
// import asyncValidate from './asyncValidate'

// const validate = values => {
//   const errors = {}
//   const requiredFields = [ 'firstName', 'lastName', 'email', 'favoriteColor', 'notes' ]
//   requiredFields.forEach(field => {
//     if (!values[ field ]) {
//       errors[ field ] = 'Required'
//     }
//   })
//   if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
//     errors.email = 'Invalid email address'
//   }
//   return errors
// }

// const renderTextField = ({ input, label, meta: { touched, error }, ...custom }) => (
//   <TextField hintText={label}
//     floatingLabelText={label}
//     errorText={touched && error}
//     {...input}
//     {...custom}
//   />
// )

// const renderCheckbox = ({ input, label }) => (
//   <Checkbox label={label}
//     checked={input.value ? true : false}
//     onCheck={input.onChange}/>
// )

// const renderRadioGroup = ({ input, ...rest }) => (
//   <RadioButtonGroup {...input} {...rest}
//     valueSelected={input.value}
//     onChange={(event, value) => input.onChange(value)}/>
// )

// const renderSelectField = ({ input, label, meta: { touched, error }, children }) => (
//   <SelectField
//     floatingLabelText={label}
//     errorText={touched && error}
//     {...input}
//     onChange={(event, index, value) => input.onChange(value)}
//     children={children}/>
// )

// const MaterialUiForm = props => {
//   const { handleSubmit, pristine, reset, submitting } = props
//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <Field name="firstName" component={renderTextField} label="First Name"/>
//       </div>
//       <div>
//         <Field name="lastName" component={renderTextField} label="Last Name"/>
//       </div>
//       <div>
//         <Field name="email" component={renderTextField} label="Email"/>
//       </div>
//       <div>
//         <Field name="sex" component={renderRadioGroup}>
//           <RadioButton value="male" label="male"/>
//           <RadioButton value="female" label="female"/>
//         </Field>
//       </div>
//       <div>
//         <Field name="favoriteColor" component={renderSelectField} label="Favorite Color">
//           <MenuItem value={'ff0000'} primaryText="Red"/>
//           <MenuItem value={'00ff00'} primaryText="Green"/>
//           <MenuItem value={'0000ff'} primaryText="Blue"/>
//         </Field>
//       </div>
//       <div>
//         <Field name="employed" component={renderCheckbox} label="Employed"/>
//       </div>
//       <div>
//         <Field name="notes" component={renderTextField} label="Notes" multiLine={true} rows={2}/>
//       </div>
//       <div>
//         <button type="submit" disabled={pristine || submitting}>Submit</button>
//         <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values
//         </button>
//       </div>
//     </form>
//   )
// }

// export default reduxForm({
//   form: 'MaterialUiForm',  // a unique identifier for this form
//   validate,
//   asyncValidate
// })(MaterialUiForm)