import React from 'react';
import Content from '../helpers/content';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {bindActionCreators} from 'redux';
import {Notification} from '../notification';
import {getNotifications} from '../../actions';

class Notifications extends React.Component {
    constructor(props) {
        super(props);
        this.wait = false;
        this.throttle = 500;
        this.state = {
            loaded: false
        };
    }

    componentDidUpdate(oldProps) {
        if (oldProps.notifications.value.length === 0 &&
            this.props.notifications.value.length > 0) {
            this.populateNotifications();
        }
    }

    componentDidMount() {
        if (this.props.notifications.value.length > 0) {
            this.populateNotifications();
        }
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
        if (!this.wait && $(window).scrollTop() + $(window).height() > $(document).height() - 50) {
            this.populateNotifications();
            this.wait = true;
            setTimeout(() => {
                if (this.wait) this.wait = false;
            }, this.throttle);
        }
    }

    populateNotifications() {
        if (this.state.loaded) return;
        const {notifications: {value}} = this.props;
        const offset = value.length;
        const limit = 15;
        this.props.getNotifications(offset, limit)
            .then((notifications) => {
                if (notifications.length < limit) {
                    this.setState({
                        loaded: true
                    });
                }
            });
    }

    notificationList() {
        const {notifications: {value, lastAllRead}} = this.props;
        return value.map((notification, i) => {
            return (
                <Notification
                    key={i}
                    notification={notification}
                    lastAllRead={lastAllRead}/>
            )
        })
    }

    render() {
        return (
            <Content title='Notifications'>
                <ul className='menu'>
                    { this.notificationList() }
                </ul>
            </Content>
        );
    }
}

const mapStateToProps = (state) => ({
    notifications: state.notifications,
    loading: state.loading
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getNotifications
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);