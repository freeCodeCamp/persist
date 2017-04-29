import { UPDATE_USER_ERROR, UPDATE_USER_PENDING, UPDATE_USER_SUCCESS, SPINNER_PAGE } from './types';
import { axios } from './utils';

const updateUser = user =>
    dispatch => {
        dispatch({
            type: SPINNER_PAGE,
            payload: true
        });
        return axios()
            .patch('/users', user)
            .then(() => {
                dispatch({
                    type: UPDATE_USER_SUCCESS,
                    payload: user
                });
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
            })
            .catch(err => {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: err
                });
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
            });
    };

export default updateUser;
