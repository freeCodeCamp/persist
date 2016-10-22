import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Content from '../helpers/content';

import StudentFilter from '../student/StudentFilter';
import StudentTable from '../student/StudentTable';

import * as getStudent from '../../actions/getStudent';


class Students extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Content title='Students'>
        <StudentFilter/>
        <StudentTable  {...this.props} students={ this.props.studentFilter.students } />
      </Content>
      );
  }
}


const mapStateToProps = (state) => {
  return {
    studentFilter: state.studentFilter
  };
};

export default connect(
  mapStateToProps, getStudent
)(Students);
