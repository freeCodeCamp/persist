import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getUsers} from '../../actions';
import Content from '../helpers/content';
import {Users} from '../users';
import {Permission} from '../authentication';

class InviteUsers extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getUsers();
    }

    render() {
        return (
            <Permission role='Owner'>
                <Content title='Invite Users'>
                    <Users />
                </Content>
            </Permission>
        );
    }
}

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getUsers
    }, dispatch)
);

export default connect(null, mapDispatchToProps)(InviteUsers);
