import React, { Component } from 'react';
import { Accordion, Panel, Col, Row, Clearfix } from 'react-bootstrap';
import { reduxForm, Field } from 'redux-form';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RaisedButton } from 'material-ui';
import { exportStudents, setSpinnerPage, exportArray } from '../../actions';
import GroupCheckbox from './GroupCheckbox';
import { studentKeys, applicationKeys, caseNotesKeys, termKeys } from '../../../../common/fieldKeys';
import exportKeys from '../../../../common/exportKeys';
import mapLimit from 'async/mapLimit';
import _ from 'lodash';

const studentKeysObj = _.keyBy(studentKeys, 'dbName');
const studentCategoryObj = _.groupBy(studentKeys, 'category');
delete studentCategoryObj.undefined;
_.forOwn(studentCategoryObj, (value, key) => {
    studentCategoryObj[key] = studentCategoryObj[key].map(field => field.dbName);
});

class ExportCSV extends Component {
    constructor(props) {
        super(props);
        this.studentAliases = [];
        this.styles = {
            button: {
                margin: 5
            }
        };
        this.state = {};
    }

    changeState(name, value) {
        this.setState({
            [name]: value
        });
    }

    referenceFields(students, fieldTypes) {
        const { schoolObj, collegeObj } = this.props;
        return new Promise((resolve, reject) => {
            mapLimit(
                students,
                100,
                (student, callback) => {
                    fieldTypes['college'].forEach(field => {
                        const studentField = student[field];
                        if (studentField && collegeObj[studentField]) {
                            student[field] = collegeObj[studentField].fullName;
                        }
                    });
                    fieldTypes['school'].forEach(field => {
                        const studentField = student[field];
                        if (studentField && schoolObj[studentField]) {
                            student[field] = schoolObj[studentField].name;
                        }
                    });
                    fieldTypes['checkbox'].forEach(field => {
                        const studentField = student[field];
                        student[field] = `"${studentField.join(',')}"`;
                    });
                    fieldTypes['checkbox_add'].forEach(field => {
                        const studentField = student[field];
                        student[field] = `"${studentField.join(',')}"`;
                    });
                    fieldTypes['datepicker'].forEach(field => {
                        const studentField = student[field];
                        const dateString = moment(studentField).format('l');
                        if (dateString !== 'Invalid Date') {
                            student[field] = dateString;
                        }
                    });
                    if (student.aliases && student.aliases.length > 0) {
                        const aliases = student.aliases.map(alias => {
                            const aliasStudent = _.cloneDeep(student);
                            ['firstName', 'middleName', 'lastName', 'suffix'].map(
                                aliasField => aliasStudent[aliasField] = alias[aliasField]
                            );
                        });
                        aliases.unshift(student);
                        this.studentAliases.push(...aliases);
                        setTimeout(() => {
                            callback(null, null);
                        });
                    } else {
                        setTimeout(
                            () => {
                                callback(null, student);
                            },
                            0
                        );
                    }
                },
                (err, finalData) => {
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    return resolve(finalData);
                }
            );
        });
    }

    handleStudents() {
        this.props.setSpinnerPage(true);
        const selectedKeys = _.reduce(
            studentCategoryObj,
            (result, value, key) => {
                if (this.state[key]) {
                    return result.concat(value);
                }
                return result;
            },
            []
        );
        if (!selectedKeys.includes('osis')) {
            selectedKeys.unshift('osis');
        }
        selectedKeys.push('aliases');
        const { students } = this.props;
        const picked = students.map(student => _.pick(student, selectedKeys)).filter(student => !_.isEmpty(student));
        const fieldTypes = exportKeys(selectedKeys, studentKeys);
        selectedKeys.pop();
        this.referenceFields(picked, fieldTypes)
            .then(finalData => {
                finalData.push(...this.studentAliases);
                this.props.exportStudents(selectedKeys, finalData);
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleApplications() {
        this.props.setSpinnerPage(true);
        const { students } = this.props;
        const picked = [].concat.apply(
            [],
            students.map(student => student.applications.map(application => _.extend({}, application, { osis: student.osis })))
        );
        const selectedKeys = _.map(applicationKeys, 'dbName');
        const fieldTypes = exportKeys(selectedKeys, applicationKeys);
        this.referenceFields(picked, fieldTypes)
            .then(finalData => {
                this.props.exportArray(finalData, 'applications');
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleTerms() {
        this.props.setSpinnerPage(true);
        const { students } = this.props;
        const picked = [].concat.apply([], students.map(student => student.terms.map(term => _.extend({}, term, { osis: student.osis }))));
        const selectedKeys = _.map(termKeys, 'dbName');
        const fieldTypes = exportKeys(selectedKeys, termKeys);
        this.referenceFields(picked, fieldTypes)
            .then(finalData => {
                this.props.exportArray(finalData, 'terms');
            })
            .catch(err => {
                console.log(err);
            });
    }

    handleCaseNotes() {
        this.props.setSpinnerPage(true);
        const { students } = this.props;
        const picked = [].concat.apply(
            [],
            students.map(student => student.caseNotes.map(caseNote => _.extend({}, caseNote, { osis: student.osis })))
        );
        const selectedKeys = _.map(caseNotesKeys, 'dbName');
        const fieldTypes = exportKeys(selectedKeys, caseNotesKeys);
        this.referenceFields(picked, fieldTypes)
            .then(finalData => {
                this.props.exportArray(finalData, 'caseNotes');
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const { styles } = this;
        const state = this.state;
        const exportKeys = _.keys(studentCategoryObj);
        const exportKeysHTML = [];
        exportKeys.map((field, i) => {
            exportKeysHTML.push(
                <Col key={field} style={{ display: 'flex', justifyContent: 'center' }} xs={12} sm={6} md={4} lg={3}>
                    <GroupCheckbox changeState={(name, value) => this.changeState(name, value)} checked={!!state[field]} label={field} />
                </Col>
            );
            if ((i + 1) % 2 === 0) {
                exportKeysHTML.push(<Clearfix key={`${field}-sm-${i}`} visibleSmBlock />);
            }
            if ((i + 1) % 3 === 0) {
                exportKeysHTML.push(<Clearfix key={`${field}-md-${i}`} visibleMdBlock />);
            }
            if ((i + 1) % 4 === 0) {
                exportKeysHTML.push(<Clearfix key={`${field}-lg-${i}`} visibleLgBlock />);
            }
        });
        return (
            <Accordion>
                <Panel header="Export" eventKey="1">
                    <form>
                        <Row>
                            {exportKeysHTML}
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <RaisedButton style={styles.button} label="Students" primary={true} onClick={() => this.handleStudents()} />
                                <RaisedButton
                                    style={styles.button}
                                    label="Applications"
                                    primary={true}
                                    onClick={() => this.handleApplications()}
                                />
                                <RaisedButton style={styles.button} label="Terms" primary={true} onClick={() => this.handleTerms()} />
                                <RaisedButton
                                    style={styles.button}
                                    label="Case Notes"
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

const mapStateToProps = state => ({
    collegeObj: state.colleges.idObj,
    schoolObj: state.schools.idObj
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            exportStudents,
            setSpinnerPage,
            exportArray
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ExportCSV);
