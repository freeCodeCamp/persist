import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

export default (ComposedComponent) => {
    class Authentication extends Component {
        componentWillMount() {
            const {authenticated, push} = this.props;
            if (!authenticated) {
                push('/login');
            }
        }

        componentWillUpdate(nextProps) {
            const {push} = this.props;
            if (!nextProps.authenticated) {
                push('/login');
            }
        }

        render() {
            const {authenticated} = this.props;
            if (authenticated) {
                return (
                    <ComposedComponent {...this.props} />
                )
            }
            return null;
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

    return connect(mapStateToProps, mapDispatchToProps)(Authentication);
}
