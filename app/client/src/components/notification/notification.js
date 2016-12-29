import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {push} from 'react-router-redux';
import {markReadNotification} from '../../actions';
import classNames from 'classnames';

class Notification extends Component {

    constructor(props) {
        super(props);
    }

    markRead(e, id) {
        e.preventDefault();
        const {notification} = this.props;
        if (notification.read) {
            return;
        }
        return this.props.markReadNotification(id);
    }

    handleClick(e, notification) {
        if (e.target === this.readComp) {
            return;
        }
        e.preventDefault();
        const {notifId} = notification;
        if (!notification.read) {
            this.props.markReadNotification(notifId._id);
        }
        this.props.push(`/student/${notifId.student.osis}`)
    }

    render() {
        const {notification, lastAllRead} = this.props;
        let {read, notifId} = notification;
        if (moment(notifId.createdAt).isBefore(lastAllRead)) {
            read = true;
        }
        const time = moment(notifId.createdAt).fromNow();
        const userName = `${notifId.user.profile.firstName} ${notifId.user.profile.lastName}`.trim();

        let backgroundColor = '#f7f7f7';
        let title = 'Mark as Read';
        if (read) {
            backgroundColor = '#ffffff';
            title = 'Read';
        }
        let readClass = classNames({
            'fa fa-circle-o': read,
            'fa fa-circle': !read
        });
        return (
            <li style={{backgroundColor}}>
                <a style={{cursor: 'pointer'}} onClick={(e) => this.handleClick(e, notification)}>
                    <h4 style={{margin: 0}}>{ notifId.student.fullName }
                        <small className='pull-right'>
                            <i className='fa fa-clock-o'
                               style={{fontSize: 10}}/> {time}
                        </small>
                    </h4>
                    <p style={{margin: 0}}>
                        {`${userName}`}
                        <small className='pull-right'>
                            <i ref={(c) => this.readComp = c}
                               className={readClass}
                               onClick={(e) => this.markRead(e, notifId._id)}
                               style={{fontSize: 10, cursor: 'default'}}
                               data-toggle='tooltip'
                               title={title}/>
                        </small>
                    </p>
                </a>
            </li>
        );
    }
}

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        markReadNotification,
        push
    }, dispatch)
);

export default connect(null, mapDispatchToProps)(Notification);
