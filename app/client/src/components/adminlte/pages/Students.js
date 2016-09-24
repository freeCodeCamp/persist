import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import StudentFilter from '../studentfilter/StudentFilter';
import StudentTable from '../studentfilter/StudentTable';


class Students extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {

        return (
        	<div>
                <h1>Students</h1>
                <StudentFilter />
                <StudentTable students={this.props.studentFilter.students} />
        	</div>
        );
    };
}


function mapStateToProps(state) {
  return { studentFilter: state.studentFilter };
}

export default connect(
  mapStateToProps
)(Students);
