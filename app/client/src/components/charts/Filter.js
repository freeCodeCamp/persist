import React from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {studentKeys} from '../../../../common/fieldKeys';
import {ReduxFormGroup} from '../helpers';
import {SelectField, TextField, AutoComplete} from 'redux-form-material-ui';
import RangeSlider from '../helpers/RangeSlider';
import {AutoComplete as MUIAutoComplete} from 'material-ui';

class ChartFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filteredKeys: [],
            suggestions: {
                'firstName': [],
                'lastName': []
            }
        }
    }

    componentDidMount() {
        const fields = [
            'ethnicity',
            'hs',
            'intendedCollege',
            'gender',
            'cohort'
        ];
        const filteredKeys = studentKeys
            .filter((field) => fields.includes(field.dbName));
        this.setState({
            ...this.state,
            filteredKeys
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.students !== nextProps.students) {
            const {students} = nextProps;
            const lodashStudents = _(students);
            const firstNameSuggestions = lodashStudents
                .map('firstName').uniq().value();
            const lastNameSuggestions = lodashStudents
                .map('lastName').uniq().value();
            this.setState({
                ...this.state,
                suggestions: {
                    firstName: firstNameSuggestions,
                    lastName: lastNameSuggestions
                }
            });
        }
    }

    updateInput(columnName, form, value) {
        if (value) {
            form.props.change.bind(form, columnName, value)();
        }
    }

    fieldsHTML(form) {
        const {filteredKeys} = this.state;
        const nullValueFields = ['hs', 'intendedCollege'];
        return filteredKeys.map((key, i) => {
            let nullValue = false;
            if (nullValueFields.includes(key.dbName)) {
                nullValue = true;
            }
            return (
                <div key={ i }>
                    <ReduxFormGroup
                        nullAllowed={nullValue}
                        form={form}
                        field={ key }
                    />
                </div>
            );
        });
    }

    checkEmpty(columnName, form, value) {
        if (value.length === 0) {
            form.props.change.bind(form, columnName, null)();
        }
    }

    render() {
        const {handleSubmit, handleFormSubmit} = this.props;
        const {suggestions} = this.state;
        const gradYearDropDowns = [];
        const currYear = new Date().getFullYear();
        for (let i = 2011; i <= currYear; i++) {
            gradYearDropDowns.push(
                <MenuItem value={ i } key={ i } primaryText={ i }/>
            )
        }
        return (
            <form onSubmit={ handleSubmit(handleFormSubmit) }>
                <div style={ {display: 'flex', flexWrap: 'wrap'} }>
                    <div>
                        <Field
                            name='firstName'
                            hintText='First Name'
                            floatingLabelText='First Name'
                            component={AutoComplete}
                            input={{
                                onUpdateInput: this.checkEmpty.bind(this, 'firstName', this),
                                onChange: this.updateInput.bind(this, 'firstName', this)
                            }}
                            dataSource={ suggestions['firstName'] }
                            maxSearchResults={5}
                        />
                    </div>
                    <div>
                        <Field
                            name='lastName'
                            hintText='Last Name'
                            floatingLabelText='Last Name'
                            component={AutoComplete}
                            input={{
                                onUpdateInput: this.checkEmpty.bind(this, 'lastName', this),
                                onChange: this.updateInput.bind(this, 'lastName', this)
                            }}
                            dataSource={ suggestions['lastName'] }
                            maxSearchResults={5}
                        />
                    </div>
                    <div>
                        <Field name='hsGradYear'
                               component={ SelectField }
                               hintText='Grad Year'
                               floatingLabelText='Grad Year'>
                            { gradYearDropDowns }
                        </Field>
                    </div>
                    {this.fieldsHTML(this)}
                    <div>
                        <Field name='hsGPA'
                               component={ RangeSlider }
                               description='High School GPA'
                               defaultRange={ {minValue: 0, maxValue: 100} }
                               min={ 0 }
                               form={this}
                               max={ 100 }
                               step={ 1 }/>
                    </div>
                </div>
                <div>
                    <RaisedButton type='submit' label='Filter' primary={ true }/>
                </div>
            </form>
        );
    }
}
// a unique name for this form
ChartFilter = reduxForm({
    form: 'chartFilterStudents'
})(ChartFilter);

const mapStateToProps = (state) => ({
    students: state.students.value
});

export default connect(mapStateToProps)(ChartFilter);
