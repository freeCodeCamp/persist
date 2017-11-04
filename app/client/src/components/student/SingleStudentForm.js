import React from 'react';
import { FieldArray, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Accordion, Panel, Form, Row, Col, Clearfix } from 'react-bootstrap';
import { socket } from '../utils';
import { RaisedButton, Snackbar } from 'material-ui';
import FormGroup from '../helpers/ReduxFormGroup';
import renderDocuments from './Documents';
import renderTerms from './Terms';
import renderApplications from './Applications';
import renderCaseNotes from './CaseNotes';
import renderAliases from './Aliases';
import * as updateStudent from '../../actions/updateStudent';
import { studentKeys } from '../../../../common/fieldKeys';
import asyncValidate from '../helpers/asyncValidate';
import keyBy from 'lodash/keyBy';
const studentKeysObj = keyBy(studentKeys, 'dbName');

class SingleStudentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editable: false,
            notification: {
                success: false,
                error: false
            }
        };
    }

    handleFormSubmit(studentRecord) {
        //this will handle updates
        const { auth } = this.props;
        socket.emit('update', {
            user: auth.user._id,
            school: studentRecord.hs,
            student: studentRecord._id,
            text: 'New Notification'
        });
        this.props.updateStudent(studentRecord);
        this.setState({
            editable: !this.state.editable
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updateStudentStatus.error) {
            this.setState({
                ...this.state,
                notification: {
                    error: true,
                    success: false
                }
            });
        } else if (nextProps.updateStudentStatus.success) {
            this.setState({
                ...this.state,
                notification: {
                    error: false,
                    success: true
                }
            });
        }
    }

    toggleEdit() {
        this.setState({
            editable: !this.state.editable
        });
    }

    render() {
        const { handleSubmit, reset, initialValues } = this.props;
        const { editable } = this.state;
        const renderFormGroups = (form, studentKeys) => {
            const HTML = [];
            studentKeys.map((field, i) => {
                field = studentKeysObj[field];
                let disabled = !editable;
                if (!field.editable) {
                    disabled = true;
                }
                const initialValue = initialValues[field.dbName];
                HTML.push(
                    <Col
                        key={field.dbName}
                        style={{ minHeight: 100, display: 'flex', justifyContent: 'center' }}
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                    >
                        <FormGroup
                            form={form}
                            style={{}}
                            initValue={initialValue}
                            key={i}
                            disabled={disabled}
                            field={field}
                            floatingLabelStyle={field.multiLineLabel ? { top: '16px' } : {}}
                        />
                    </Col>
                );
                if ((i + 1) % 2 === 0) {
                    HTML.push(<Clearfix key={`${field.dbName}-sm-md-${i}`} visibleSmBlock visibleMdBlock />);
                }
                if ((i + 1) % 3 === 0) {
                    HTML.push(<Clearfix key={`${field.dbName}-lg-${i}`} visibleLgBlock />);
                }
            });
            return HTML;
        };

        let basicProfile, contactInfo, academicInfo, financialInfo, colApplications, historicalInfo, hasGradDate;
        if (initialValues['hsGradDate'] && new Date(initialValues['hsGradDate']) !== 'Invalid Date') {
            basicProfile = [
                'altName',
                'dob',
                'mostRecentCol',
                'levelOfSupport',
                'suffix',
                'hs',
                'hsGradYear',
                'nscRecordFound',
                'descriptors',
                'preferredPronoun',
                'residency'
            ];
            contactInfo = ['cellPhone', 'otherPhone', 'email', 'facebookName', 'address'];
            academicInfo = [
                'postSecPlan',
                'intendedCollege',
                'remediationStatus',
                'registeredForClasses',
                'majorMinor',
                'cumColGPA',
                'progressToGradAss',
                'progressToGradBa',
                'transferStatus',
                'ferpa'
            ];
            financialInfo = [
                'studentSupportOrgName',
                'mostRecentEmp',
                'needGap',
                'fsaid',
                'studentSupportOrgNameOther',
                'employmentStatus',
                'amountOfNeedGap'
            ];
            historicalInfo = ['hsGPA', 'SAT.math', 'SAT.cr', 'actEquiv', 'crewAdvisor', 'hsGradDate', 'cohort', 'hsDiplomaType'];
            colApplications = [];
            hasGradDate = true;
        } else {
            basicProfile = [
                'altName',
                'dob',
                'descriptors',
                'preferredPronoun',
                'suffix',
                'hs',
                'cohort',
                'expectedHSGrad',
                'crewAdvisor',
                'levelOfSupport'
            ];
            contactInfo = ['cellPhone', 'otherPhone', 'email', 'facebookName', 'address', 'parentName', 'parentContact'];
            academicInfo = ['hsGPA', 'psat', 'SAT.math', 'SAT.cr', 'regents.ela', 'regents.math', 'SAT.subjectTests', 'actEquiv'];
            financialInfo = [
                'opportunityProgramEligible',
                'startedFafsa',
                'completedFafsa',
                'fsaid',
                'cssProfileCreated',
                'taxDocumentsSubmitted',
                'awardLetterReceived',
                'studentAidReportReceived',
                'needGap',
                'amountOfNeedGap'
            ];
            colApplications = [
                'applicationWave',
                'eaEdApplications',
                'completedEssay',
                'lettersOfRecommendation',
                'cunyApp',
                'sunyApp',
                'commonApp',
                'appliedToOtherSupportProgram',
                'postSecPlan',
                'intendedCollege',
                'desiredFieldOfStudy',
                'registeredForClasses',
                'studentSupportOrgName',
                'studentSupportOrgNameOther',
                'ferpa'
            ];
            historicalInfo = [];
            hasGradDate = false;
        }

        return (
            <div id="single-student-page">
                <Form className="single-student-form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                    <Row className="text-right">
                        {editable ? <RaisedButton label="Submit" type="submit" primary={true} /> : null}
                        {editable ? (
                            <RaisedButton label="Undo" secondary={true} onClick={reset} />
                        ) : (
                            <RaisedButton label="Edit" primary={true} onClick={() => this.toggleEdit()} />
                        )}
                    </Row>
                    <Row>
                        <FieldArray
                            name="documents"
                            osis={initialValues.osis}
                            disabled={!editable}
                            form={this}
                            component={renderDocuments}
                            initValue={initialValues['documents']}
                        />
                        <FieldArray
                            name="aliases"
                            osis={initialValues.osis}
                            disabled={!editable}
                            form={this}
                            component={renderAliases}
                            initValue={initialValues['aliases']}
                        />
                        <h2>Basic Profile</h2>
                        <Row>{renderFormGroups(this, basicProfile)}</Row>
                        <h2>Student Contact</h2>
                        <Row>{renderFormGroups(this, contactInfo)}</Row>
                        <h2>Academic Information</h2>
                        <Row>{renderFormGroups(this, academicInfo)}</Row>
                        <h2>Financial Profile</h2>
                        <Row>{renderFormGroups(this, financialInfo)}</Row>
                        {hasGradDate ? <h2>College Applications</h2> : <h2>Historical Information</h2>}
                        <Row>
                            {renderFormGroups(this, colApplications)}
                            {renderFormGroups(this, historicalInfo)}
                        </Row>
                        <FieldArray
                            name="applications"
                            osis={initialValues.osis}
                            form={this}
                            component={renderApplications}
                            initValue={initialValues['applications']}
                        />
                        <FieldArray
                            name="caseNotes"
                            osis={initialValues.osis}
                            form={this}
                            component={renderCaseNotes}
                            initValue={initialValues['caseNotes']}
                        />
                        {hasGradDate ? (
                            <FieldArray
                                name="terms"
                                osis={initialValues.osis}
                                form={this}
                                component={renderTerms}
                                initValue={initialValues['terms']}
                            />
                        ) : (
                            <Accordion>
                                <Panel header="Terms" eventKey="1">
                                    Sorry! Terms cannot be shown as the student doesn't have a high school graduation date
                                </Panel>
                            </Accordion>
                        )}
                    </Row>
                    <Snackbar
                        bodyStyle={{ backgroundColor: 'red' }}
                        open={this.state.notification.error}
                        message="Something went wrong. Please try again"
                        autoHideDuration={2000}
                        onRequestClose={() => {
                            this.setState({ ...this.state, notification: { success: false, error: false } });
                        }}
                    />
                    <Snackbar
                        bodyStyle={{ backgroundColor: 'green' }}
                        open={this.state.notification.success}
                        message="Student record is updated"
                        autoHideDuration={2000}
                        onRequestClose={() => {
                            this.setState({ ...this.state, notification: { success: false, error: false } });
                        }}
                    />
                </Form>
            </div>
        );
    }
}

SingleStudentForm = reduxForm({
    form: 'SingleStudent',
    asyncValidate
})(SingleStudentForm);

function mapStateToProps(state) {
    return {
        auth: state.auth,
        updateStudentStatus: state.updateStudent
    };
}

export default connect(mapStateToProps, updateStudent)(SingleStudentForm);
