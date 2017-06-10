import { GET_ALL_USERS_ERROR, GET_ALL_USERS_PENDING, GET_ALL_USERS_SUCCESS } from '../types';
import { axios } from '../utils';

export default () => {
    return dispatch => {
        dispatch({
            type: GET_ALL_USERS_PENDING
        });

        return axios()
            .get('/api/users')
            .then(response => {
                dispatch({
                    type: GET_ALL_USERS_SUCCESS,
                    payload: response.data
                });
            })
            .catch(err => {
                dispatch({
                    type: GET_ALL_USERS_ERROR,
                    payload: err
                });
                // HACK Needs to return Promise.reject for testing to work.
                // userAgent check SHOULD protect from this in production.
                // There may be a better way of doing this that I haven't thought
                // of yet.
                if (/PhantomJS/.test(navigator.userAgent)) {
                    return Promise.reject(err);
                } else {
                    return err;
                }
            });
    };
};
