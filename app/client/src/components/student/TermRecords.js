import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {Field} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import {SelectField} from 'redux-form-material-ui';
import DatePicker from '../helpers/DatePicker';
import {types} from '../../../../server/models/validation/validator';
import {connect} from 'react-redux';

class TermRecords extends Component {

    constructor(props) {
        super(props);
    }

    updateInput(value, columnName) {
        const {form} = this.props;
        if (value) {
            form.props.change.bind(form, columnName, value)();
        }
    }

    initValue(term) {
        const {collegeObj} = this.props;
        if (term && term.college && collegeObj[term.college]) {
            return collegeObj[term.college].fullName || '';
        }
        return '';
    }

    render() {
        const {fields, collegeSource, initValue} = this.props;
        const terms = fields.map((term, index) => (
            <tr key={index}>
                <td style={{width: 256}}>
                    <AutoComplete
                        name={`${term}.college`}
                        searchText={this.initValue(initValue[index])}
                        filter={AutoComplete.caseInsensitiveFilter}
                        onNewRequest={(v) => this.updateInput(v.value, `${term}.college`)}
                        dataSource={collegeSource}
                        maxSearchResults={5}
                    />
                </td>
                <td style={{width: 100}}>
                    <Field name={`${term}.status`}
                           style={{maxWidth: 100}}
                           component={ SelectField }
                           hintText='Status'>
                        {types['terms.status'].map((status, i) => (
                            <MenuItem value={status} key={i} primaryText={status}/>
                        ))}
                    </Field>
                </td>
                <td style={{width: 180}} className='term-record--date-field'>
                    <Field name={`${term}.enrolBegin`}
                           style={{maxWidth: 160}}
                           hintText='Enrollment Begin'
                           container='inline'
                           component={ DatePicker }
                    />
                </td>
                <td style={{width: 180}} className='term-record--date-field'>
                    <Field name={`${term}.enrolEnd`}
                           style={{maxWidth: 160}}
                           hintText='Enrollment End'
                           container='inline'
                           component={ DatePicker }
                    />
                </td>
                <td style={{verticalAlign: 'middle', width: 50}}>
                    <div className='term-record--action-button' onClick={() => fields.remove(index)}>
                        <i className='fa fa-times' aria-hidden={true}/>
                    </div>
                </td>
            </tr>
        ));
        return (
            <Table responsive condensed className='term-record'>
                <thead>
                <tr>
                    <th colSpan='5'>
                        <h4 style={ {textAlign: 'center'} }>College Term Records</h4>
                    </th>
                </tr>
                <tr>
                    <th>College</th>
                    <th>
                        Status
                    </th>
                    <th>
                        Enrolment Begin Date
                    </th>
                    <th>
                        Enrolment End Date
                    </th>
                </tr>
                </thead>
                <tbody>
                { terms }
                <tr>
                    <td className='term-record--add-term' colSpan='5' onClick={() => fields.push({})}>
                        <a>Add Term</a>
                    </td>
                </tr>
                </tbody>
            </Table>
        );
    }
}

const mapStateToProps = (state) => ({
    collegeSource: state.colleges.collegeSource,
    collegeObj: state.colleges.idObj
});

export default connect(mapStateToProps)(TermRecords);
