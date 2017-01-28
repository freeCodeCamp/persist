import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {bindActionCreators} from 'redux';
import {exportStudents} from '../../actions';
import Content from '../helpers/content';
import _ from 'lodash';
import mapLimit from 'async/mapLimit';
import {studentKeys} from '../../../../common/fieldKeys';
import exportKeys from '../../../../common/exportKeys';
import {RaisedButton} from 'material-ui';
import {Panel, PanelGroup} from 'react-bootstrap';

class Schools extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 1
        };
    }

    handleSelect(activeKey) {
        this.setState({
            activeKey
        });
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

    exportSchool(students, year) {
        const filteredStudents = students.filter((student) => student.hsGradYear === year);
        const selectedKeys = ['firstName', 'lastName', 'osis', 'intendedCollege', 'mostRecentCol', 'mostRecentEnrolStatus', 'cellPhone', 'email'];
        const picked = filteredStudents.map((student) => _.pick(student, selectedKeys));
        const fieldTypes = exportKeys(selectedKeys, studentKeys);
        this.referenceFields(picked, fieldTypes)
            .then((finalData) => {
                this.props.exportStudents(selectedKeys, finalData);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        const {schools} = this.props;
        const schoolHTML = schools.map((school, i) => {
            const exportButtonsHTML = school.hsGradYears.map((year) => (
                <RaisedButton
                    key={`${school}-${year}`}
                    style={{marginLeft: 4, marginRight: 4}}
                    label={year}
                    onClick={() => this.exportSchool(school.students, year)}/>
            ));
            return (
                <Panel header={ school.name } eventKey={ i } key={ i }>
                    {exportButtonsHTML.length > 0 ? exportButtonsHTML : 'No students found'}
                </Panel>
            );
        });
        return (
            <Content title='Schools'>
                <PanelGroup activeKey={ this.state.activeKey } onSelect={ this.handleSelect.bind(this) } accordion>
                    { schoolHTML }
                </PanelGroup>
            </Content>
        );
    }
}

const getStudents = (state) => state.students.value;
const getSchools = (state) => state.schools.value;

const makeHSGradYears = () => {
    return createSelector(
        [getStudents, getSchools],
        (students, schools) => {
            return schools.map((school, i) => {
                const filteredStudents = _(students).filter({hs: school._id}).value();
                const hsGradYears = _(filteredStudents).map('hsGradYear')
                    .uniq().map(Number).compact().sort().value();
                return {
                    _id: school._id,
                    name: school.name,
                    hsGradYears,
                    students: filteredStudents
                };
            })
        }
    )
};

const makeMapStateToProps = () => {
    const getSchools = makeHSGradYears();
    const mapStateToProps = (state, props) => {
        return {
            schools: getSchools(state, props),
            collegeObj: state.colleges.idObj,
            schoolObj: state.schools.idObj
        }
    };
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        exportStudents
    }, dispatch)
);

export default connect(makeMapStateToProps, mapDispatchToProps)(Schools);
