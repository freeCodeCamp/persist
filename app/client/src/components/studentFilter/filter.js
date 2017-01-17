import React, {Component} from 'react';
import {Accordion, Panel, Col, Row} from 'react-bootstrap';
import {reduxForm, Field} from 'redux-form';
import {RaisedButton} from 'material-ui';
import {RangeSlider} from '../helpers';
import moment from 'moment';
import {Checkbox} from 'redux-form-material-ui';
import ReduxFormGroup from '../helpers/ReduxFormGroup';
import {studentKeys} from '../../../../common/fieldKeys';
import _ from 'lodash';
const studentKeysObj = _.keyBy(studentKeys, 'dbName');
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
const extraFilters = {
    enrolLast6: 'Enrolled in last 6 months',
    fallNotSpring: 'Have a term record for fall of most recent year but not spring of following year',
    fallAndSpringNotSpring: 'Enrolled in fall and spring of year after graduation but then NOT the following fall (year 2 dropoff)',
    '43NotAssociate': 'Earned a total of 43 credits toward an associate’s degree and have not received a degree',
    '103NotBachelor': 'Earned a total of 103 credits toward a bachelor’s degree and have not received a degree',
    'partTimeAfterFull': 'Enrolled part time the most recent semester after being enrolled Full time the semester before that'
};
const extraKeys = _.keys(extraFilters);

class StudentFilter extends Component {
    constructor(props) {
        super(props);
    }

    filterStudents(values) {
        let conditions = _(values).omitBy(_.isNil).cloneDeep();
        const {students} = this.props;
        const hsGPA = conditions.hsGPA;
        delete conditions.hsGPA;
        conditions = _.pickBy(conditions, (value, key) => (
            !extraKeys.includes(key)
        ));
        const extraConditions = _.pickBy(conditions, (value, key) => (
            extraKeys.includes(key)
        ));
        let filteredStudents = _(students)
            .filter(conditions);
        if (!(hsGPA.min === 0 && hsGPA.max === 100)) {
            filteredStudents = filteredStudents
                .filter((student) => {
                    return student.hsGPA > hsGPA.min && student.hsGPA < hsGPA.max;
                });
        }
        if (extraConditions.enrolLast6) {
            filteredStudents = filteredStudents
                .filter((student) => {
                    if (student.terms < 1) return false;
                    return (Math.abs(moment(new Date()).diff(moment(student.terms[0].enrolEnd), 'months')) < 6);
                });
        }
        if (extraConditions.fallAndSpringNotSpring) {
            filteredStudents = filteredStudents
                .filter((student) => {
                    if (student.terms < 2 || !student.hsGradYear) return false;
                    const hsGradYear = student.hsGradYear;
                    const studentTermNames = _(student.terms).map('name');
                    if (
                        studentTermNames.includes('Fall ' + hsGradYear) &&
                        studentTermNames.includes('Spring ' + (hsGradYear + 1))
                    ) {
                        return !studentTermNames.includes('Fall ' + (hsGradYear + 1));
                    }
                    return false;
                });
        }
        // if (extraConditions['43NotAssociate']) {
        //     filteredStudents = filteredStudents
        //         .filter((student) => {
        //
        //         });
        // }
        this.setState({
            filteredStudents
        });
    }

    render() {
        const {handleSubmit} = this.props;
        const filterKeysHTML = (form) => {
            const fieldsHTML = filterKeys.map((filterKey) => {
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
            });
            // hsGPA
            fieldsHTML.push(
                <Col style={{minHeight: 100}} xs={12} sm={6} md={4} lg={3} key='hsGPA'>
                    <Field
                        name='hsGPA'
                        component={ RangeSlider }
                        description='HS GPA'
                        defaultRange={ {minValue: 0, maxValue: 100} }
                        min={ 0 }
                        form={form}
                        max={ 100 }
                        step={ 1 }
                    />
                </Col>
            );
            // extra fields
            extraKeys.forEach((field) => {
                fieldsHTML.push(
                    <Col xs={12} sm={12} md={12} lg={12} key={field}>
                        <Field
                            name={field}
                            component={ Checkbox }
                            label={extraFilters[field]}
                        />
                    </Col>
                );
            });
            return fieldsHTML;
        };
        return (
            <form onSubmit={ handleSubmit((v) => this.filterStudents(v)) }>
                <Row>
                    {filterKeysHTML(this)}
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <RaisedButton type='submit' label='Filter' primary={true}/>
                    </Col>
                </Row>
            </form>
        );
    }
}

StudentFilter = reduxForm({
    form: 'StudentFilter'
})(StudentFilter);

export default StudentFilter;
