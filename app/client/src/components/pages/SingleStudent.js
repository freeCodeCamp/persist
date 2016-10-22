import React from 'react';
import { connect } from 'react-redux';

import * as getStudent from '../../actions/getStudent';

import SingleStudentForm from '../student/SingleStudentForm';
import Content from '../helpers/content';

class SingleStudent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('params to component', this.props.params);
    this.props.getStudent(this.props.params.osis);
  }

  render() {
    const {singleStudent} = this.props;
    const student = singleStudent.student;
    return (
      <Content>
        { singleStudent.pending ? <div>
                                    <p>
                                      Loading
                                    </p><i style={ { fontSize: '50px', textAlign: 'center' } } className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                                  </div> : null }
        { singleStudent.error ? <p>
                                  Error Found
                                </p> : null }
        { singleStudent.success ? <div>
                                    <h1 style={ { margin: '20px' } }>{ `${student.firstName} ${student.lastName}` }</h1>
                                    <SingleStudentForm initialValues={ student } student={ student } />
                                  </div> : null }


         { this.props.updateCollegeStatus.pending ? <div>
                                    <br/>
                                    <p>
                                      Loading
                                    </p><i style={ { fontSize: '50px', textAlign: 'center' } } className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                                  </div> : null }
        { this.props.updateCollegeStatus.error ? 
                                  <div>
                                  <br/>
                                  <Alert bsStyle="warning">
                                    <strong>Sorry!</strong> We encountered an error, please check the college form for any errors.
                                  </Alert>
                                  </div>
                                : null }
        { this.props.updateCollegeStatus.success ? <div>
                                    <br/>
                                    <Alert bsStyle="success">
                                      <strong>Success!</strong> We updated the college record and everything went swimmingly.
                                    </Alert>
                                    
                                  </div> : null }
      </Content>
      );
  }
}

function mapStateToProps(state) {
  return {
    singleStudent: state.singleStudent,
    updateCollegeStatus: state.updateCollege
  };
}

export default connect(mapStateToProps, getStudent)(SingleStudent);

