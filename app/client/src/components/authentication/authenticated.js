import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

class Authenticated extends Component {

    componentWillMount() {
        const {authenticated, push} = this.props;
        if (authenticated) {
            push('/');
        }
    }

    componentWillUpdate(nextProps) {
        const {push} = this.props;
        if (nextProps.authenticated) {
            push('/');
        }
    }

    render() {
        return this.props.children;
    }

}

const mapStateToProps = (state) => ({
    authenticated: state.auth.authenticated
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        push
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Authenticated);
