import React, { Component } from 'react';
import { connect } from 'react-redux';

import CollegeFilter from '../collegefilter/CollegeFilter';
import CollegeTable from '../collegefilter/CollegeTable';

class Colleges extends Component {
	render() {
		return (
			<div>
                <h1>Colleges</h1>
                <CollegeFilter />
                <CollegeTable colleges={this.props.collegeFilter.colleges} />
        	</div>
		);
	}
}


function mapStateToProps(state) {
  return { collegeFilter: state.collegeFilter };
}

export default connect(
  mapStateToProps
)(Colleges)