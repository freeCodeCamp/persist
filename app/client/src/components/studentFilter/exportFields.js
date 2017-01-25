import React, {Component} from 'react';
import {Accordion, Panel, Col, Row, Clearfix} from 'react-bootstrap';
import {reduxForm, Field} from 'redux-form';
import moment from 'moment';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {RaisedButton} from 'material-ui';
import {exportStudents, setSpinnerPage, exportArray} from '../../actions';
import {Checkbox} from 'redux-form-material-ui';
import {studentKeys, applicationKeys, caseNotesKeys, termKeys} from '../../../../common/fieldKeys';
import exportKeys from '../../../../common/exportKeys';
import mapLimit from 'async/mapLimit';
import keyBy from 'lodash/keyBy';
import extend from 'lodash/extend';
import pickBy from 'lodash/pickBy';
import pick from 'lodash/pick';
import keys from 'lodash/keys';
const studentKeysObj = keyBy(studentKeys, 'dbName');

class ExportCSV extends Component {
    constructor(props) {
        super(props);
        this.styles = {
            button: {
                margin: 5
            }
        };
    }

    referenceFields(students, fieldTypes) {
        const {schoolObj, collegeObj} = this.props;
        return new Promise((resolve, reject) => {
            mapLimit(students, 100, (student, callback) => {
                fieldTypes['college'].forEach((field) => {
                    const studentField = student[field];
                    if (studentField && collegeObj[studentField]) {
                        student[field] = collegeObj[studentField].fullName;
                    }
                });
                fieldTypes['school'].forEach((field) => {
                    const studentField = student[field];
                    if (studentField && schoolObj[studentField]) {
                        student[field] = schoolObj[studentField].name;
                    }
                });
                fieldTypes['checkbox'].forEach((field) => {
                    const studentField = student[field];
                    student[field] = `"${studentField.join(',')}"`;
                });
                fieldTypes['checkbox_add'].forEach((field) => {
                    const studentField = student[field];
                    student[field] = `"${studentField.join(',')}"`;
                });
                fieldTypes['datepicker'].forEach((field) => {
                    const studentField = student[field];
                    const dateString = moment(studentField).format('l');
                    if (dateString !== 'Invalid Date') {
                        student[field] = dateString;
                    }
                });
                setTimeout(() => {
                    callback(null, student);
                }, 0);
            }, (err, finalData) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                return resolve(finalData);
            });
        });
    }

    handleStudents(values) {
        this.props.setSpinnerPage(true);
        const selectedKeys = keys(pickBy(values, (v) => (v)));
        const {students} = this.props;
        const picked = students.map((student) => pick(student, selectedKeys));
        const fieldTypes = exportKeys(selectedKeys, studentKeys);
        this.referenceFields(picked, fieldTypes)
            .then((finalData) => {
                this.props.exportStudents(selectedKeys, finalData);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleApplications() {
        this.props.setSpinnerPage(true);
        const {students} = this.props;
        const picked = [].concat
            .apply([], students.map((student) =>
                student.applications.map((application) => (
                    extend({}, application, {osis: student.osis})
                ))));
        const selectedKeys = _.map(applicationKeys, 'dbName');
        const fieldTypes = exportKeys(selectedKeys, applicationKeys);
        this.referenceFields(picked, fieldTypes)
            .then((finalData) => {
                this.props.exportArray(finalData, 'applications');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleTerms() {
        this.props.setSpinnerPage(true);
        const {students} = this.props;
        const picked = [].concat
            .apply([], students.map((student) =>
                student.terms.map((term) => (
                    extend({}, term, {osis: student.osis})
                ))));
        const selectedKeys = _.map(termKeys, 'dbName');
        const fieldTypes = exportKeys(selectedKeys, termKeys);
        this.referenceFields(picked, fieldTypes)
            .then((finalData) => {
                this.props.exportArray(finalData, 'terms');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleCaseNotes() {
        this.props.setSpinnerPage(true);
        const {students} = this.props;
        const picked = [].concat
            .apply([], students.map((student) =>
                student.caseNotes.map((caseNote) => (
                    extend({}, caseNote, {osis: student.osis})
                ))));
        const selectedKeys = _.map(caseNotesKeys, 'dbName');
        const fieldTypes = exportKeys(selectedKeys, caseNotesKeys);
        this.referenceFields(picked, fieldTypes)
            .then((finalData) => {
                this.props.exportArray(finalData, 'caseNotes');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        const {styles} = this;
        const {handleSubmit} = this.props;
        const exportKeys = keys(studentKeysObj);
        const exportKeysHTML = [];
        exportKeys.map((field, i) => {
            exportKeysHTML.push(
                <Col key={field}
                     style={{display: 'flex', justifyContent: 'center'}} xs={12}
                     sm={6} md={4}
                     lg={3}>
                    <Field
                        name={field}
                        component={Checkbox}
                        label={studentKeysObj[field].displayName}
                    />
                </Col>
            );
            if ((i + 1) % 2 === 0) {
                exportKeysHTML.push(<Clearfix key={`${field}-sm-${i}`} visibleSmBlock/>);
            }
            if ((i + 1) % 3 === 0) {
                exportKeysHTML.push(<Clearfix key={`${field}-md-${i}`} visibleMdBlock/>);
            }
            if ((i + 1) % 4 === 0) {
                exportKeysHTML.push(<Clearfix key={`${field}-lg-${i}`} visibleLgBlock/>);
            }
        });
        return (
            <Accordion>
                <Panel header='Export' eventKey='1'>
                    <form>
                        <Row>
                            { exportKeysHTML }
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <RaisedButton
                                    style={styles.button}
                                    label='Students'
                                    primary={true}
                                    onClick={handleSubmit((v) => this.handleStudents(v))}
                                />
                                <RaisedButton
                                    style={styles.button}
                                    label='Applications'
                                    primary={true}
                                    onClick={() => this.handleApplications()}
                                />
                                <RaisedButton
                                    style={styles.button}
                                    label='Terms'
                                    primary={true}
                                    onClick={() => this.handleTerms()}
                                />
                                <RaisedButton
                                    style={styles.button}
                                    label='Case Notes'
                                    primary={true}
                                    onClick={() => this.handleCaseNotes()}
                                />
                            </Col>
                        </Row>
                    </form>
                </Panel>
            </Accordion>
        );
    }
}

ExportCSV = reduxForm({
    form: 'ExportCSV'
})(ExportCSV);

const mapStateToProps = (state) => ({
    collegeObj: state.colleges.idObj,
    schoolObj: state.schools.idObj
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        exportStudents,
        setSpinnerPage,
        exportArray
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ExportCSV);
