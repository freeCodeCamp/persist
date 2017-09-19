import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm, Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { SelectField, AutoComplete } from 'redux-form-material-ui';
import { AutoComplete as MUIAutoComplete } from 'material-ui';

import { types } from '../../../../common/validator';

class FilterStudentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: {
                firstName: [],
                lastName: []
            }
        };
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
        const { students } = this.props;
        const regex = new RegExp('.*' + value + '.*', 'i');
        const suggestions = _(students)
            .filter(student => regex.test(student[columnName]))
            .map(columnName)
            .uniq()
            .sortBy()
            .take(5)
            .value();
        this.setSuggestions(columnName, suggestions);
    }

    render() {
        const { handleSubmit, onSubmit, collegeSource } = this.props;
        const { suggestions } = this.state;

        const hsOptions = types.hs;
        const hsDropDowns = hsOptions.map((hs, i) => <MenuItem value={hs} key={i} primaryText={hs} />);
        const gradYearDropDowns = [];
        const currYear = new Date().getFullYear();
        for (let i = 2011; i <= currYear; i++) {
            gradYearDropDowns.push(<MenuItem value={i} key={i} primaryText={i} />);
        }

        return (
            <form onSubmit={handleSubmit(onSubmit.bind(this))}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div>
                        <Field
                            name="firstName"
                            component={AutoComplete}
                            filter={MUIAutoComplete.caseInsensitiveFilter}
                            dataSource={suggestions['firstName']}
                            input={{
                                onUpdateInput: this.handleUpdateInput.bind(this, 'firstName', this),
                                onChange: this.handleUpdateInput.bind(this, 'firstName', this)
                            }}
                            floatingLabelText="First Name"
                        />
                    </div>
                    <div>
                        <Field
                            name="lastName"
                            component={AutoComplete}
                            filter={MUIAutoComplete.caseInsensitiveFilter}
                            dataSource={suggestions['lastName']}
                            input={{
                                onUpdateInput: this.handleUpdateInput.bind(this, 'lastName', this),
                                onChange: this.handleUpdateInput.bind(this, 'lastName', this)
                            }}
                            floatingLabelText="Last Name"
                        />
                    </div>
                    <div>
                        <MUIAutoComplete
                            name="intendedCollege"
                            openOnFocus={true}
                            filter={MUIAutoComplete.caseInsensitiveFilter}
                            onNewRequest={this.handleUpdateInput.bind(this, `intendedCollege`, this)}
                            dataSource={collegeSource}
                            maxSearchResults={5}
                            floatingLabelText="Intended College"
                        />
                    </div>
                    <div>
                        <Field name="gender" component={SelectField} hintText="Gender" floatingLabelText="Gender">
                            <MenuItem value="M" primaryText="Male" />
                            <MenuItem value="F" primaryText="Female" />
                        </Field>
                    </div>
                    <div>
                        <Field name="hsGradYear" component={SelectField} hintText="Grad Year" floatingLabelText="Grad Year">
                            {gradYearDropDowns}
                        </Field>
                    </div>
                    <div>
                        <Field name="hs" component={SelectField} hintText="High School" floatingLabelText="High School">
                            {hsDropDowns}
                        </Field>
                    </div>
                </div>
                <div>
                    <RaisedButton type="submit" label="Filter" primary={true} />
                </div>
            </form>
        );
    }
}

FilterStudentForm = reduxForm({
    form: 'FilterStudent' // a unique name for this form
})(FilterStudentForm);

const mapStateToProps = state => {
    return {
        students: state.students.value,
        collegeSource: state.colleges.collegeSource
    };
};

// You have to connect() to any reducers that you wish to connect to yourself
export default connect(mapStateToProps)(FilterStudentForm);
