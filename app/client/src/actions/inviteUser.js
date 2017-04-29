import { INVITE_USER_ERROR, INVITE_USER_PENDING, INVITE_USER_SUCCESS, SPINNER_PAGE } from './types';
import { axios } from './utils';

const inviteUser = user =>
    dispatch => {
        dispatch({
            type: SPINNER_PAGE,
            payload: true
        });
        return axios()
            .post('/users', user)
            .then(res => {
                dispatch({
                    type: INVITE_USER_SUCCESS,
                    payload: res.data
                });
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
            })
            .catch(err => {
                dispatch({
                    type: INVITE_USER_ERROR,
                    payload: err
                });
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
            });
    };

export default inviteUser;
