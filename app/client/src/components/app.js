import React, {Component} from 'react';
import Dashboard from './DashBoard';
import {socket} from './utils';
import {connect} from 'react-redux';

class App extends Component {

    componentDidMount() {
        const {auth} = this.props;
        socket.emit('subscribe', {room: auth.user._id});
        socket.emit('subscribe', {room: auth.user.school});
    }

    componentWillUnmount() {
        const {auth} = this.props;
        socket.emit('unsubscribe', {room: auth.user._id});
        socket.emit('unsubscribe', {room: auth.user.school});
    }

    render() {
        let currentPage;
        if (this.props.children) {
            currentPage = React.cloneElement(this.props.children, ...this.props);
        }

        return (
            <Dashboard currentPage={ currentPage }/>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(App);
