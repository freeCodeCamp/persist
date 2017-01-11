import React, {Component} from 'react';
import {Link} from 'react-router';
import NotificationItem from './notification-item';
import {markReadAllNotification} from '../../../../actions';
import {updateNotification} from '../../../../actions/socket';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {socket} from '../../../utils';

class HeaderNotifications extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        socket.on('notification', this.props.updateNotification);
    }

    markAllRead(e) {
        e.preventDefault();
        this.props.markReadAllNotification();
    }

    render() {
        const {notificationsObj} = this.props;
        const notifications = notificationsObj.value;
        const unread = notificationsObj.unread;
        const lastAllRead = notificationsObj.lastAllRead;
        const notificationList = notifications.map((notification, iterator) => {
            return (
                <NotificationItem key={ iterator } lastAllRead={lastAllRead} notification={notification}/>
            );
        });

        return (
            <li className='dropdown notifications-menu'>
                <a href='#' className='dropdown-toggle' data-toggle='dropdown'>
                    <i className='fa fa-bell-o'/>
                    { unread > 0 ?
                        <span className='label label-warning'>{ unread }</span> : null }
                </a>
                <ul className='dropdown-menu'>
                    <li className='header'>
                        <span>You have { unread } notifications</span>
                        <span style={{cursor: 'pointer', color: '#3c8dbc'}} className='pull-right'
                              onClick={(e) => this.markAllRead(e)}>Mark all read</span>
                    </li>
                    <li>
                        { /* inner menu: contains the actual data */ }
                        <div className='slimScrollDiv'>
                            <ul className='menu'>
                                { notificationList }
                            </ul>
                            <div className='slimScrollBar'></div>
                            <div className='slimScrollRail'></div>
                        </div>
                    </li>
                    <li className='footer'>
                        <Link to='/notifications'>View all</Link>
                    </li>
                </ul>
            </li>
        );
    }

}

const mapStateToProps = (state) => ({
    notificationsObj: state.notifications,
    reminders: state.reminders
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        markReadAllNotification,
        updateNotification
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(HeaderNotifications);
