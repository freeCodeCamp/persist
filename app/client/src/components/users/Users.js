import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {IconButton, RefreshIndicator, RaisedButton, FloatingActionButton, Dialog, FlatButton} from 'material-ui';
import {submit} from 'redux-form';
import {updateUser, deleteUser, inviteUser} from '../../actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import sortBy from 'lodash/sortBy';
import UserEditor from './UserEditor';
import {ContentDeleteSweep, ContentAdd} from 'material-ui/svg-icons';

class Users extends Component {
    constructor(props) {
        super(props);
        this.user = {};
        this.state = {
            open: {
                edit: false,
                delete: false
            }
        };
    }

    disableUser(user) {
        user.enabled = false;
        this.props.updateUser(user);
    }

    enableUser(user) {
        user.enabled = true;
        this.props.updateUser(user);
    }

    renderUsers() {
        const {schoolObj} = this.props;
        let {users} = this.props;
        users = sortBy(users, 'access.role');
        const usersHTML = users.map((user, index) => {
            const enabled = user.enabled;
            const school = user.access.school;
            return (
                <tr key={index}>
                    <td>{user.profile.firstName}</td>
                    <td>{user.email}</td>
                    <td>{user.access.role}</td>
                    <td>{school ?
                        schoolObj[school].name :
                        '--'}
                    </td>
                    <td>
                        { enabled ?
                            <RaisedButton onClick={() => this.disableUser(user)} label='disable' primary={true}/> :
                            <RaisedButton onClick={() => this.enableUser(user)} label='enable' secondary={true}/>
                        }
                        <IconButton onClick={() => this.handleDelete(user)}>
                            <ContentDeleteSweep/>
                        </IconButton>
                    </td>
                </tr>
            )
        });
        return (
            <tbody>
            {usersHTML}
            </tbody>
        );
    }

    handleDelete(user) {
        this.user = user;
        this.setState({
            open: {
                ...this.state.open,
                delete: true
            }
        });
    }

    deleteUser() {
        this.props.deleteUser(this.user)
            .then(() => (this.handleClose()));
    }

    handleEdit(user) {
        this.user = user;
        this.setState({
            open: {
                ...this.state.open,
                edit: true
            }
        });
    }

    inviteUser(user) {
        this.props.inviteUser(user)
            .then(() => (
                this.handleClose()
            ));
    }

    handleInvite() {
        this.props.submit('UserEditor');
    }

    handleClose() {
        this.setState({
            open: {
                delete: false,
                edit: false
            }
        });
    }

    renderDeleteDialog() {
        const {spinner} = this.props;
        const open = this.state.open.delete;
        const actions = [
            <FlatButton
                label="Cancel"
                disabled={spinner}
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleClose()}
            />,
            <FlatButton
                label="Delete"
                disabled={spinner}
                primary={true}
                onTouchTap={() => this.deleteUser()}
            />
        ];
        return (
            <Dialog actions={actions} open={open}>
                Delete User?
            </Dialog>
        );
    }

    renderEditDialog() {
        const {spinner} = this.props;
        const user = this.user;
        const open = this.state.open.edit;
        const actions = [
            <FlatButton
                label="Cancel"
                disabled={spinner}
                primary={true}
                onTouchTap={() => this.handleClose()}
            />,
            <FlatButton
                label="Save"
                disabled={spinner}
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => this.handleInvite()}
            />
        ];
        return (
            <Dialog actions={actions} open={open} title='Invite User'>
                <UserEditor initialValues={user} onSubmit={this.inviteUser.bind(this)}/>
            </Dialog>
        );
    }

    render() {
        const {users, loading} = this.props;
        if (loading) {
            return (
                <RefreshIndicator
                    size={40}
                    left={10}
                    top={0}
                    status="loading"
                    style={{display: 'inline-block', position: 'relative'}}
                />
            )
        }
        const tableHead = (
            <thead>
            <tr>
                <th>First Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>School</th>
                <th>Actions</th>
            </tr>
            </thead>
        );
        return (
            <div>
                {users.length > 0 ?
                    <Table responsive condensed>
                        {tableHead}
                        {this.renderUsers()}
                    </Table> : null
                }
                <FloatingActionButton mini={true} onClick={() => this.handleEdit({})}>
                    <ContentAdd />
                </FloatingActionButton>
                {this.renderEditDialog()}
                {this.renderDeleteDialog()}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    spinner: state.spinner,
    loading: state.users.pending,
    users: state.users.value,
    schoolObj: state.schools.idObj
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        updateUser,
        deleteUser,
        inviteUser,
        submit
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Users);
