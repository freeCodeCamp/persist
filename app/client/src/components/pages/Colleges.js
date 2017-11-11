import React, { Component } from 'react';
import Content from '../helpers/content';
import CollegeFilter from '../college/CollegeFilter';
import CollegeTable from '../college/CollegeTable';
import { RaisedButton } from 'material-ui';
import { values } from 'lodash';
import { connect } from 'react-redux';
import { exportColleges, setSpinnerPage } from '../../actions';
import { bindActionCreators } from 'redux';

class Colleges extends Component {
    constructor() {
        super();
        this.state = {
            colleges: []
        };
    }

    setColleges(colleges) {
        this.setState({
            colleges
        });
    }

    handleColleges() {
        this.props.setSpinnerPage(true);
        const { collegeObj } = this.props;
        this.props.exportColleges(values(collegeObj));
    }

    render() {
        return (
            <Content title="Colleges">
                <CollegeFilter setColleges={colleges => this.setColleges(colleges)} />
                <CollegeTable colleges={this.state.colleges} />
                <RaisedButton label="Export Colleges" primary={true} onClick={() => this.handleColleges()} />
            </Content>
        );
    }
}

const mapStateToProps = state => ({
    collegeObj: state.colleges.idObj
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            setSpinnerPage,
            exportColleges
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Colleges);
