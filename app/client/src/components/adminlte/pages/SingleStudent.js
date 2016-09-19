import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import * as actions from '../../../actions';


class SingleStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student: null
        };
    }

    componentDidMount() {

        const _this = this;

       this.props.getStudent(this.props.params.contactID);

    }
    
    render() {
        const { singleStudent } = this.props;
        return (
        	<div>
        		<h1>Single Student Page</h1>
                
                {singleStudent.pending ? <div><p>Loading</p><i style={{fontSize: '50px', textAlign: 'center'}} className="fa fa-spinner fa-spin fa-3x fa-fw"></i></div> : null}
                {singleStudent.error ? <p> Error Found </p> : null}
                {singleStudent.success ? <p> {JSON.stringify(singleStudent.student)} </p> : null}


        	</div>
        	);
    }
}

function mapStateToProps(state) {
  return { singleStudent: state.singleStudent };
}

export default connect(mapStateToProps, actions)(SingleStudent);

