import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {reduxForm, Field} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {SelectField, TextField, AutoComplete} from 'redux-form-material-ui';
import DatePicker from '../../helpers/DatePicker';
import {AutoComplete as MUIAutoComplete} from 'material-ui';
import {types} from '../../../../../server/models/validation/validator';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class TermRecord extends Component {
    constructor(props) {
        super(props);
    }

    handleUpdateInput(columnName, form, value) {
        if (value != null && typeof value === 'object') {
            form.props.change.bind(form, columnName, value.value)();
            return;
        }
        form.props.change.bind(form, columnName, value)();
    }

    render() {
        const {term, index, collegeSource} = this.props;
        return (
            <tr>
                <td>
                    <Field name={`${term}.college`}
                           component={ AutoComplete }
                           filter={ MUIAutoComplete.caseInsensitiveFilter }
                           dataSource={ collegeSource }
                           input={ {
                               onUpdateInput: this.handleUpdateInput.bind(this, 'intendedCollege', this),
                               onChange: this.handleUpdateInput.bind(this, 'intendedCollege', this)
                           } }
                           maxSearchResults={5}
                    />
                </td>
                <td>
                    <Field name={`${term}.status`}
                           style={{maxWidth: 50}}
                           component={ SelectField }
                           hintText='Status'>
                        {types['terms.status'].map((status) => (
                            <MenuItem value={status} primaryText={status}/>
                        ))}
                    </Field>
                </td>
                <td>
                    <Field name={`${term}.enrolBegin`}
                           style={{maxWidth: 120}}
                           hintText='Enrollment Begin'
                           container='inline'
                           component={ DatePicker }
                    />
                </td>
                <td>
                    <Field name={`${term}.enrolEnd`}
                           style={{maxWidth: 120}}
                           hintText='Enrollment End'
                           container='inline'
                           component={ DatePicker }
                    />
                </td>
                <td>
                    <td onClick={handleSubmit(saveTerm.bind(null, id))}>
                        Save
                    </td>
                </td>
            </tr>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.college) {
        errors.college = 'Required';
    }
    if (!values.name) {
        errors.name = 'Required';
    }
    if (!values.enrolBegin) {
        errors.enrolBegin = 'Required';
    }
    if (!values.enrolEnd) {
        errors.enrolEnd = 'Required';
    }
    return errors;
};

// TermRecord = reduxForm({
//     validate
// })(TermRecord);

const mapStateToProps = (state) => ({
    collegeSource: state.colleges.collegeSource
});

export default connect(mapStateToProps)(TermRecord);
