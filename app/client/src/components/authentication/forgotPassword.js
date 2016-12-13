import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {MaterialUIWrapper} from '../helpers';
import {push} from 'react-router-redux';
import {RaisedButton, Snackbar} from 'material-ui';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getForgotPasswordToken} from '../../actions';
import {TextField} from 'redux-form-material-ui';
import {Authenticated} from './';

class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: '',
            redirect: false
        };
    }

    handleForgotPassword(values) {
        const {reset} = this.props;
        this.props.getForgotPasswordToken(values)
            .then(() => {
                this.setState({
                    open: true,
                    message: 'Please check your email and follow instructions to reset your password.',
                    redirect: true
                });
                reset();
            })
            .catch(() => {
                this.setState({
                    open: true,
                    message: 'A user with this email does not exist.'
                });
                reset();
            });
    }

    closeSnackBar() {
        const {redirect} = this.state;
        this.setState({
            open: false
        }, () => {
            if (redirect) {
                this.props.push('/login');
            }
        });
    }

    render() {
        const {handleSubmit} = this.props;
        const {open, message} = this.state;
        return (
            <Authenticated>
                <MaterialUIWrapper>
                    <div className='forgot-password-page'>
                        <form onSubmit={handleSubmit(this.handleForgotPassword.bind(this))}
                              className='forgot-password-page--form'>
                            <h3>Forgot password?</h3>
                            <p>We just need your registered Email Id to send you password reset instructions.</p>
                            <div style={{height: 90}}>
                                <Field
                                    name='email'
                                    component={TextField}
                                    style={{width: '100%'}}
                                    type='email'
                                    hintText='Email'
                                    floatingLabelText='Email'
                                />
                            </div>
                            <RaisedButton
                                className='forgot-password-page--submit-button'
                                style={{width: '100%'}}
                                type='submit'
                                label="reset password"
                                primary={true}/>
                            {message.length > 0 ?
                                <Snackbar
                                    open={open}
                                    message={message}
                                    autoHideDuration={6000}
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
    return errors;
};

ForgotPassword = reduxForm({
    form: 'forgotPassword',
    validate
})(ForgotPassword);

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        getForgotPasswordToken,
        push
    }, dispatch)
);

export default connect(null, mapDispatchToProps)(ForgotPassword);
