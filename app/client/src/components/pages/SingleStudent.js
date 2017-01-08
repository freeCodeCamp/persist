import React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import SingleStudentForm from '../student/SingleStudentForm';
import Content from '../helpers/content';
import isEmpty from 'lodash/isEmpty';

class SingleStudent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {student} = this.props;
        const studentData = student.data;
        return (
            <div>
                {student.success && student.data ?
                    <Content title={studentData.fullName}>
                        <div>
                            <SingleStudentForm
                                enableReinitialize={true}
                                initialValues={ studentData }
                                student={ studentData }/>
                        </div>
                    </Content> : student.success && !student.data ?
                    <div>No Records Found</div> :
                    <div>
                        <p>
                            Loading
                        </p><i style={ {fontSize: '50px', textAlign: 'center'} }
                               className="fa fa-spinner fa-spin fa-3x fa-fw"/>
                    </div>
                }
            </div>
        );
    }
}

const getStudents = (state) => state.students.osisObj;
const getCounselors = (state) => state.counselors.idObj;
const getOSIS = (_, props) => props.params.osis;

const makeGetStudent = () => {
    return createSelector(
        [getStudents, getCounselors, getOSIS],
        (students, counselors, osis) => {
            if (isEmpty(students) || isEmpty(counselors)) {
                return {success: false, data: null}
            }
            return {success: true, data: students[osis]};
        }
    )
};

const makeMapStateToProps = () => {
    const getStudent = makeGetStudent();
    const mapStateToProps = (state, props) => {
        return {
            student: getStudent(state, props),
            collegeObj: state.colleges.idObj
        }
    };
    return mapStateToProps;
};

export default connect(makeMapStateToProps)(SingleStudent);

