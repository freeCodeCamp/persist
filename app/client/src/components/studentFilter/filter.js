import React, {Component} from 'react';
import {Accordion, Panel, Col, Row, Clearfix} from 'react-bootstrap';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import {RaisedButton} from 'material-ui';
import {RangeSlider, Content} from '../helpers';
import StudentTable from '../student/StudentTable';
import ExportCSV from '../studentFilter/exportFields';
import moment from 'moment';
import {Checkbox} from 'redux-form-material-ui';
import ReduxFormGroup from '../helpers/ReduxFormGroup';
import exportKeys from '../../../../common/exportKeys';
import {validateArray} from '../../../../common/constants';
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
    'intendedCollege',
    'progressToGradAss',
    'progressToGradBa',
    'opportunityProgramEligible',
    'completedFafsa',
    'completedTap'
];
const extraFilters = {
    enrolLast6: 'Current Student',
    fallNotSpring: 'Enrolled in fall of most recent year but not in following spring',
    fallAndSpringNotSpring: 'Enrolled in fall and spring of year after graduation but then NOT the following fall (year 2 dropoff)',
    // '43NotAssociate': 'Earned a total of 43 credits toward an associate’s degree and have not received a degree',
    // '103NotBachelor': 'Earned a total of 103 credits toward a bachelor’s degree and have not received a degree',
    partTimeAfterFull: 'Enrolled part time the most recent semester after being enrolled Full time the semester before that',
    enrolAfterGraduation: 'Enrolled first semester after graduation'
};
const extraKeys = _.keys(extraFilters);

class StudentFilter extends Component {
    constructor(props) {
        super(props);
        this.showStudentsTable = false;
        this.state = {
            filteredStudents: []
        };
    }

    filterStudents(values) {
        this.showStudentsTable = true;
        let conditions = _(values).omitBy(_.isNil).cloneDeep();
        const { students } = this.props;
        const hsGPA = conditions.hsGPA;
        delete conditions.hsGPA;
        const extraConditions = _.pick(conditions, extraKeys);
        const arrayConditions = _(conditions)
            .omit(extraKeys).pickBy((value, key) => (
                studentKeysObj[key].fieldType === 'Checkbox'
            )).value();
        conditions = _.omit(conditions, [..._.keys(extraConditions), ..._.keys(arrayConditions)]);
        let filteredStudents = _(students)
            .filter(conditions);
        filteredStudents = filteredStudents
            .filter((student) => {
                let take = true;
                _.forOwn(arrayConditions, (value, key) => {
                    if (!validateArray(value, student[key])) {
                        take = false;
                        return false;
                    }
                });
                return take;
            });
        if (!(hsGPA.min === 0 && hsGPA.max === 100)) {
            filteredStudents = filteredStudents
                .filter((student) => {
                    return student.hsGPA > hsGPA.min && student.hsGPA < hsGPA.max;
                });
        }
        if (extraConditions.enrolLast6) {
            filteredStudents = filteredStudents
                .filter((student) => {
                    if (student.terms.length < 1) return false;
                    return (Math.abs(moment(new Date()).diff(moment(student.terms[0].enrolEnd), 'months')) < 6);
                });
        }
        if (extraConditions.fallNotSpring) {
            filteredStudents = filteredStudents
                .filter((student) => {
                    let year = new Date().getFullYear();
                    if (moment([year, 10, 15]).diff(moment(new Date()), 'days') > 0) {
                        year -= 1;
                    }
                    const studentTermNames = _(student.terms).map('name');
                    if (studentTermNames.includes('Fall ' + (year - 1))) {
                        return !studentTermNames.includes('Spring ' + year);
                    }
                    return false;
                });
        }
        if (extraConditions.fallAndSpringNotSpring) {
            filteredStudents = filteredStudents
                .filter((student) => {
                    if (student.terms.length < 2 || !student.hsGradYear) return false;
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
        if (extraConditions.partTimeAfterFull) {
            filteredStudents = filteredStudents
                .filter((student) => {
                    if (student.terms.length < 2) return false;
                    const studentStatus = _(student.terms).map('status');
                    if (studentStatus[0] === 'H') {
                        return studentStatus[1] === 'F';
                    }
                    return false;
                });
        }
        if (extraConditions.enrolAfterGraduation) {
            filteredStudents = filteredStudents
                .filter((student) => {
                    if (student.terms.length < 1 || !student.hsGradDate) return false;
                    const totalTerms = student.terms;
                    return Math.abs(moment(student.terms[totalTerms - 1].enrolBegin).diff(moment(student.hsGradDate), 'months')) < 6;
                });
        }
        this.setState({
            filteredStudents: filteredStudents.value()
        });
    }

    render() {
        const { handleSubmit } = this.props;
        const { filteredStudents } = this.state;
        const filterKeysHTML = (form) => {
            const fieldsHTML = [];
            filterKeys.map((filterKey, i) => {
                const field = studentKeysObj[filterKey];
                fieldsHTML.push(
                    <Col key={field.dbName}
                         style={{ minHeight: 100, display: 'flex', justifyContent: 'center' }}
                         xs={12}
                         sm={6} md={6}
                         lg={4}>
                        <ReduxFormGroup
                            name={field.dbName}
                            form={form}
                            field={field}
                        />
                    </Col>
                );
                if ((i + 1) % 2 === 0) {
                    fieldsHTML.push(<Clearfix key={`${field.dbName}-sm-md-${i}`} visibleSmBlock visibleMdBlock />);
                }
                if ((i + 1) % 3 === 0) {
                    fieldsHTML.push(<Clearfix key={`${field.dbName}-lg-${i}`} visibleLgBlock />);
                }
            });
            // hsGPA
            fieldsHTML.push(
                <Col key='hsGPA'
                     style={{ minHeight: 100, display: 'flex', justifyContent: 'center' }} xs={12}
                     sm={6} md={6}
                     lg={4}>
                    <Field
                        name='hsGPA'
                        component={ RangeSlider }
                        description='HS GPA'
                        defaultRange={ { minValue: 0, maxValue: 100 } }
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
            <Content title='Students'>
                <form onSubmit={ handleSubmit((v) => this.filterStudents(v)) }>
                    <Row>
                        {filterKeysHTML(this)}
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <RaisedButton type='submit' label='Filter' primary={true} />
                        </Col>
                    </Row>
                </form>
                <ExportCSV students={filteredStudents} />
                {this.showStudentsTable ?
                    <StudentTable students={filteredStudents} /> : null }
            </Content>
        );
    }
}

StudentFilter = reduxForm({
    form: 'StudentFilter'
})(StudentFilter);

const mapStateToProps = (state) => ({
    students: state.students.value
});

export default connect(mapStateToProps)(StudentFilter);
