import React from 'react';
import Content from '../helpers/content';
import ChartFilter from '../charts/Filter';
import {ChartTabs} from '../dashboard';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import _ from 'lodash';

class DashboardMain extends React.Component {
    constructor(props) {
        super(props);
        this.update = false;
        this.state = {
            filteredStudents: []
        };
    }

    handleSubmit(values) {
        this.update = true;
        const conditions = _.cloneDeep(values);
        const {students} = this.props;
        const hsGPA = conditions.hsGPA;
        delete conditions.hsGPA;
        const filteredStudents = _(students).filter(conditions).filter((student) => {
            if (hsGPA.min === 0 && hsGPA.max === 100) return true;
            return student.hsGPA > hsGPA.min && student.hsGPA < hsGPA.max;
        }).value();
        this.setState({
            filteredStudents
        });
    }

    shouldComponentUpdate() {
        if (this.update) {
            this.update = false;
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.students.length === 0 && nextProps.students.length > 0) {
            this.update = true;
            this.setState({
                filteredStudents: nextProps.students
            });
        }
    }

    render() {
        return (
            <Content title='Welcome'>
                <ChartFilter handleFormSubmit={this.handleSubmit.bind(this)}/>
                <ChartTabs students={this.state.filteredStudents}/>
            </Content>
        );
    }
}

DashboardMain = reduxForm({
    form: 'chartFilterStudents'
})(DashboardMain);

const mapStateToProps = (state) => {
    return {
        students: state.students.value,
        filters: state.form.chartFilterStudents
    };
};

DashboardMain = connect(mapStateToProps)(DashboardMain);

export default DashboardMain;
