import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {MaterialUIWrapper} from '../helpers';
import {push} from 'react-router-redux';
import {RaisedButton, Snackbar} from 'material-ui';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updatePassword} from '../../actions';
import {TextField} from 'redux-form-material-ui';
import {Authenticated} from './';

class UpdatePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: '',
            redirect: false
        };
    }

    handleUpdatePassword(values) {
        const {reset} = this.props;
        const token = this.props.params.token;
        delete values.confirm_password;
        this.props.updatePassword(token, values)
            .then(() => {
                this.setState({
                    open: true,
                    message: 'Your password has been updated. Please login again to continue.',
                    redirect: true
                });
                reset();
            })
            .catch((err) => {
                this.setState({
                    open: true,
                    message: err.response.data.error || 'Something went wrong. Please try again.'
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
                    <div className='update-password-page'>
                        <form onSubmit={handleSubmit(this.handleUpdatePassword.bind(this))}
                              className='update-password-page--form'>
                            <h3>Update password?</h3>
                            <p>Please enter your new password.</p>
                            <div style={{height: 90}}>
                                <Field
                                    name='password'
                                    component={TextField}
                                    style={{width: '100%'}}
                                    type='password'
                                    hintText='Password'
                                    floatingLabelText='Password'
                                />
                            </div>
                            <div style={{height: 90}}>
                                <Field
                                    name='confirm_password'
                                    component={TextField}
                                    style={{width: '100%'}}
                                    type='password'
                                    hintText='Confirm Password'
                                    floatingLabelText='Confirm Password'
                                />
                            </div>
                            <RaisedButton
                                className='update-password-page--submit-button'
                                style={{width: '100%'}}
                                type='submit'
                                label="update password"
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
    if (!values.password) {
        errors.password = 'Required';
    }
    if (!values.confirm_password) {
        errors.confirm_password = 'Required';
    } else if (values.password !== values.confirm_password) {
        errors.confirm_password = 'password doesn\'t match';
    }
    return errors;
};

UpdatePassword = reduxForm({
    form: 'updatePassword',
    validate
})(UpdatePassword);

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({
        updatePassword,
        push
    }, dispatch)
);

export default connect(null, mapDispatchToProps)(UpdatePassword);
