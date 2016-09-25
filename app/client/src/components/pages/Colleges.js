import React, { Component } from 'react';
import { connect } from 'react-redux';
import Content from '../helpers/content';

import CollegeFilter from '../college/CollegeFilter';
import CollegeTable from '../college/CollegeTable';

class Colleges extends Component {
  render() {
    return (
      <Content title='Colleges'>
        <CollegeFilter />
        <CollegeTable colleges={ this.props.collegeFilter.colleges } />
      </Content>
      );
  }
}


function mapStateToProps(state) {
  return {
    collegeFilter: state.collegeFilter
  };
}

export default connect(
  mapStateToProps
)(Colleges)