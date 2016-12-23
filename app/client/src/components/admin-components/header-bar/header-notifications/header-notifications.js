import React, {Component} from 'react';
import NotificationItem from './notification-item';
import {connect} from 'react-redux';

class HeaderNotifications extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {notifications} = this.props;
        const notificationList = notifications.map(function (notificationDetails, iterator) {
            return (
                <NotificationItem key={ iterator } theme={ notificationDetails.theme }
                                  content={ notificationDetails.content }/>
            );
        });

        return (
            <li className='dropdown notifications-menu'>
                <a href='#' className='dropdown-toggle' data-toggle='dropdown'><i className='fa fa-bell-o'></i> <span
                    className='label label-warning'>{ notifications.length }</span></a>
                <ul className='dropdown-menu'>
                    <li className='header'>
                        You have
                        { notifications.length } notifications
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
                        <a href='#'>View all</a>
                    </li>
                </ul>
            </li>
        );
    }

}

const mapStateToProps = (state) => ({
    notifications: state.notifications
});

export default connect(mapStateToProps)(HeaderNotifications);
