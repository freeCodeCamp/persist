import React, {Component} from 'react';
import {Accordion, Panel, Col, Row} from 'react-bootstrap';
import {reduxForm, Field} from 'redux-form';
import {RaisedButton} from 'material-ui';
import {Checkbox} from 'redux-form-material-ui';
import ReduxFormGroup from '../helpers/ReduxFormGroup';
import {studentKeys} from '../../../../common/fieldKeys';
import keyBy from 'lodash/keyBy';
import pickBy from 'lodash/pickBy';
import keys from 'lodash/keys';
const studentKeysObj = keyBy(studentKeys, 'dbName');
const filterKeys = [
    'transferStatus',
    'hsGradYear',
    'cohort',
    'hs',
    'nscRecordFound',
    'needGap',
    'ferpa',
    'crewAdvisor',
    'studentSupportOrgName',
    'remediationStatus',
    'hsGPA',
    'descriptors',
    'employmentStatus',
    'mostRecentCol',
    'degreeTitle',
    'progressToGradAss',
    'progressToGradBa',
    'opportunityProgramEligible',
    'completedFafsa',
    'completedTap'
];

class StudentFilter extends Component {
    constructor(props) {
        super(props);
    }

    filterStudents(conditions) {
        console.log(conditions);
    }

    render() {
        const {handleSubmit} = this.props;
        const filterKeysHTML = (form) => (
            filterKeys.map((filterKey) => {
                const field = studentKeysObj[filterKey];
                return (
                    <Col style={{minHeight: 100}} xs={12} sm={6} md={4} lg={3} key={field.dbName}>
                        <ReduxFormGroup
                            name={field.dbName}
                            form={form}
                            field={field}
                        />
                    </Col>
                );
            })
        );
        return (
            <form onSubmit={ handleSubmit((v) => this.filterStudents(v)) }>
                <Row>
                    {filterKeysHTML(this)}
                </Row>
            </form>
        );
    }
}

StudentFilter = reduxForm({
    form: 'StudentFilter'
})(StudentFilter);

export default StudentFilter;
