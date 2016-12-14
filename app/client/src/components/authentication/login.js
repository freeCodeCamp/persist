import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {MaterialUIWrapper} from '../helpers';
import {RaisedButton, Snackbar} from 'material-ui';
import {loginUser} from '../../actions';
import {Link} from 'react-router';
import {TextField} from 'redux-form-material-ui';
import {Authenticated} from './';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            errorMessage: ''
        };
    }

    handleLogin(values) {
        const {reset} = this.props;
        this.props.loginUser(values)
            .catch((err) => {
                this.setState({
                    open: true,
                    errorMessage: err.response.data.message
                });
                reset();
            })
    }

    closeSnackBar() {
        this.setState({
            open: false
        });
    }

    render() {
        const {handleSubmit} = this.props;
        const {open, errorMessage} = this.state;
        return (
            <Authenticated>
                <MaterialUIWrapper>
                    <div className='login-page'>
                        <form onSubmit={handleSubmit(this.handleLogin.bind(this))} className='login-page--form'>
                            <div className='login-page--form--logo'>
                                <img src='http://www.nycoutwardbound.org/images/NYCOBS_logo.gif' alt='site_logo'/>
                            </div>
                            <div style={{height: 90}}>
                                <Field name='email'
                                       component={ TextField }
                                       style={{width: '100%'}}
                                       hintText='Email'
                                       type='email'
                                       floatingLabelText='Email'/>
                            </div>
                            <div style={{height: 90}}>
                                <Field name='password'
                                       component={ TextField }
                                       style={{width: '100%'}}
                                       type='password'
                                       hintText='Password'
                                       floatingLabelText='Password'/>
                            </div>
                            <div className='login-page--form--actions'>
                                <RaisedButton type='submit' label='Submit' primary={true}/>
                                <Link to='/forgot-password'>Forgot password?</Link>
                            </div>
                            {errorMessage.length > 0 ?
                                <Snackbar
                                    open={open}
                                    message={errorMessage}
                                    autoHideDuration={4000}
                                    onRequestClose={() => this.closeSnackBar()}
                                /> : null }
                        </form>
                    </div>
                </MaterialUIWrapper>
            </Authenticated>
        );
    }

}

const validate = (values) => {
    const errors = {};
    if (!values.email) {
        errors.email = 'Required';
    }
    if (!values.password) {
        errors.password = 'Required';
    }
    return errors;
};

Login = reduxForm({
    form: 'login',
    validate
})(Login);

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        loginUser
    }, dispatch)
);

export default connect(null, mapDispatchToProps)(Login);
