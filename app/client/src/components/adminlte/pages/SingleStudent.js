import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import * as actions from '../../../actions';

import SingleStudentForm from '../SingleStudentForm';

class SingleStudent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
       this.props.getStudent(this.props.params.contactID);
    }
    
    render() {
        const { singleStudent } = this.props;
        const student = singleStudent.student;
        return (
        	<div>
                {singleStudent.pending ? <div><p>Loading</p><i style={{fontSize: '50px', textAlign: 'center'}} className="fa fa-spinner fa-spin fa-3x fa-fw"></i></div> : null}
                {singleStudent.error ? <p> Error Found </p> : null}
                {singleStudent.success ? <div><h1 style={{margin: '20px'}}>{`${student.firstName} ${student.lastName}`}</h1><SingleStudentForm initialValues={student} student={student}/></div> : null}
        	</div>
        	);
    }
}

function mapStateToProps(state) {
  return { singleStudent: state.singleStudent };
}

export default connect(mapStateToProps, actions)(SingleStudent);

