import axios from 'axios';
import { push } from 'react-router-redux';
import cookie from 'react-cookie';
import { LOGIN_PENDING, LOGIN_SUCCESS } from '../types';

const loginUser = ({ email, password }) =>
    dispatch => {
        dispatch({
            type: LOGIN_PENDING
        });
        return axios.post('/login', { email, password }).then(response => {
            const { token, user } = response.data;
            cookie.save('token', token, { path: '/' });
            cookie.save('user', user, { path: '/' });
            dispatch({
                type: LOGIN_SUCCESS,
                payload: user
            });
            dispatch(push('/'));
        });
    };

export default loginUser;
