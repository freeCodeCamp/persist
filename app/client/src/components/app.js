import React, {Component} from 'react';
import Dashboard from './DashBoard';
import {socket} from './utils';
import {connect} from 'react-redux';

export default class App extends Component {

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
