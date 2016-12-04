import React from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {SelectField, TextField, AutoComplete} from 'redux-form-material-ui';
import RangeSlider from '../helpers/RangeSlider';
import {AutoComplete as MUIAutoComplete} from 'material-ui';
import {types} from '../../../../server/models/validation/validator';

class ChartFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            suggestions: {
                'firstName': [],
                'lastName': []
            }
        }
    }

    handleUpdateInput(columnName, form, value) {
        if (value != null && typeof value === 'object') {
            form.props.change.bind(form, columnName, value.value)();
            return;
        }
        form.props.change.bind(form, columnName, value)();
        this.getSuggestions(columnName, value);
    }

    setSuggestions(columnName, suggestions) {
        this.setState({
            suggestions: {
                ...this.state.suggestions,
                [columnName]: suggestions
            }
        });
    }

    getSuggestions(columnName, value) {
        if (value.length < 3) {
            this.setSuggestions(columnName, []);
            return;
        }
        const {students} = this.props;
        const regex = new RegExp('.*' + value + '.*', 'i');
        const suggestions = _(students)
            .filter((student) => (regex.test(student[columnName])))
            .map(columnName)
            .uniq()
            .sortBy()
            .take(5)
            .value();
        this.setSuggestions(columnName, suggestions);
    }

    render() {
        const {handleSubmit, collegeSource} = this.props;
        const {suggestions} = this.state;

        const hsOptions = types.hs;
        const hsDropDowns = hsOptions.map((hs, i) => (
                <MenuItem value={ hs } key={ i } primaryText={ hs }/>
            )
        );
        const cohortOptions = types.cohort.map((cohort, i) => (
                <MenuItem value={cohort}
                          key={cohort}
                          primaryText={cohort}/>
            )
        );
        const gradYearDropDowns = [];
        const currYear = new Date().getFullYear();
        for (let i = 2011; i <= currYear; i++) {
            gradYearDropDowns.push(
                <MenuItem value={ i } key={ i } primaryText={ i }/>
            )
        }
        return (
            <form onSubmit={ handleSubmit(this.props.handleFormSubmit) }>
                <div style={ {display: 'flex', flexWrap: 'wrap'} }>
                    <div>
                        <Field name='firstName'
                               component={ AutoComplete }
                               filter={ MUIAutoComplete.caseInsensitiveFilter }
                               dataSource={ suggestions['firstName'] }
                               input={ {
                                   onUpdateInput: this.handleUpdateInput.bind(this, 'firstName', this),
                                   onChange: this.handleUpdateInput.bind(this, 'firstName', this)
                               } }
                               floatingLabelText='First Name'/>
                    </div>
                    <div>
                        <Field name='lastName' component={ TextField } floatingLabelText='Last Name'/>
                    </div>
                    <div>
                        <MUIAutoComplete
                            name='intendedCollege'
                            filter={ MUIAutoComplete.caseInsensitiveFilter }
                            onNewRequest={this.handleUpdateInput.bind(this, `intendedCollege`, this)}
                            dataSource={collegeSource}
                            maxSearchResults={5}
                            floatingLabelText='Intended College'
                        />
                    </div>
                    <div>
                        <Field name='gender'
                               component={ SelectField }
                               hintText='Gender'
                               floatingLabelText='Gender'>
                            <MenuItem value='M' primaryText='Male'/>
                            <MenuItem value='F' primaryText='Female'/>
                        </Field>
                    </div>
                    <div>
                        <Field name='ethnicity'
                               component={ SelectField }
                               hintText='Ethnicity'
                               floatingLabelText='Ethnicity'>
                            <MenuItem value={1} primaryText='1'/>
                            <MenuItem value={2} primaryText='2'/>
                            <MenuItem value={3} primaryText='3'/>
                            <MenuItem value={4} primaryText='4'/>
                            <MenuItem value={5} primaryText='5'/>
                            <MenuItem value={6} primaryText='6'/>
                        </Field>
                    </div>
                    <div>
                        <Field name='cohort'
                               component={ SelectField }
                               hintText='Cohort'
                               floatingLabelText='Cohort'>
                            {cohortOptions}
                        </Field>
                    </div>
                    <div>
                        <Field name='hsGradYear'
                               component={ SelectField }
                               hintText='Grad Year'
                               floatingLabelText='Grad Year'>
                            { gradYearDropDowns }
                        </Field>
                    </div>
                    <div>
                        <Field name='hs'
                               component={ SelectField }
                               hintText='High School'
                               floatingLabelText='HighSchool'>
                            { hsDropDowns }
                        </Field>
                    </div>
                    <div>
                        <Field name='hsGPA'
                               component={ RangeSlider }
                               description='High School GPA'
                               defaultRange={ {minValue: 0, maxValue: 100} }
                               min={ 0 }
                               form={this.props.form}
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
    students: state.students.value,
    collegeSource: state.colleges.collegeSource
});

export default connect(mapStateToProps)(ChartFilter);
