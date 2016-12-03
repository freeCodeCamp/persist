import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {reduxForm, Field} from 'redux-form';
import TermRecord from './TermRecord';
import MenuItem from 'material-ui/MenuItem';
import {SelectField, TextField, AutoComplete} from 'redux-form-material-ui';
import DatePicker from '../../helpers/DatePicker';
import {AutoComplete as MUIAutoComplete} from 'material-ui';
import {types} from '../../../../../server/models/validation/validator';
import uniqueId from 'lodash/uniqueId';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class TermRecords extends Component {

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
        const {fields, collegeSource} = this.props;
        const terms = fields.map((term, index) => (
            <tr key={index}>
                <td>
                    <Field name={`${term}.college`}
                           component={ AutoComplete }
                           filter={ MUIAutoComplete.caseInsensitiveFilter }
                           dataSource={ collegeSource }
                           format={(value) => (collegeSource[value])}
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
                    <div onClick={() => fields.remove(index)}>
                        remove
                    </div>
                </td>
            </tr>
        ));
        return (
            <Table>
                <thead>
                <tr>
                    <th colSpan='5'>
                        <h4 style={ {textAlign: 'center'} }>College Term Records</h4>
                    </th>
                </tr>
                <tr>
                    <th>
                        College
                    </th>
                    <th>
                        Status
                    </th>
                    <th>
                        Enrolment Begin Date
                    </th>
                    <th>
                        Enrolment End Date
                    </th>
                    <th>
                    </th>
                </tr>
                </thead>
                <tbody>
                { terms }
                </tbody>
            </Table>
        );
    }
}

const mapStateToProps = (state) => ({
    collegeSource: state.colleges.collegeSource
});

export default connect(mapStateToProps)(TermRecords);
