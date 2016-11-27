import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import _ from 'lodash';
import Content from '../helpers/content';

import StudentFilter from '../student/StudentFilter';
import StudentTable from '../student/StudentTable';

class Students extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: []
        };
    }

    onSubmit(filter) {
        const students = _(this.props.students).filter(filter).value();
        this.setState({
            students
        });
    }

    render() {
        const {students} = this.state;
        return (
            <Content title='Students'>
                <StudentFilter onSubmit={this.onSubmit.bind(this)}/>
                <StudentTable  {...this.props} students={ students }/>
            </Content>
        );
    }
}

Students = reduxForm({
    form: 'FilterStudent'
})(Students);

const mapStateToProps = (state) => {
    return {
        students: state.students.value
    };
};

export default connect(
    mapStateToProps
)(Students);
