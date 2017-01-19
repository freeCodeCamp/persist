import React, {Component} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import StudentTable from '../student/StudentTable';

class FilteredStudents extends Component {
    constructor(props) {
        super(props);
        this.students = [];
        this.state = {
            students: []
        };
    }

    componentDidMount() {
        this.updateStudents(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateStudents(nextProps);
    }

    updateStudents(props) {
        if (isEmpty(props.studentsObj)) return;
        const osisStudents = JSON.parse(localStorage.getItem('filtered'));
        this.students = osisStudents.map((osis) => (props.studentsObj[osis]));
        this.setState({
            students: this.students
        });
    }

    render() {
        return (
            <StudentTable students={this.state.students}/>
        )
    }

}

const mapStateToProps = (state) => ({
    studentsObj: state.students.osisObj
});

export default connect(mapStateToProps)(FilteredStudents);
