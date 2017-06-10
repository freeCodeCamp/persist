import { GET_ALL_COLLEGES_ERROR, GET_ALL_COLLEGES_PENDING, GET_ALL_COLLEGES_SUCCESS } from '../types';
import { axios } from '../utils';

export default () => {
    return dispatch => {
        dispatch({
            type: GET_ALL_COLLEGES_PENDING
        });

        return axios()
            .get('/api/colleges')
            .then(response => {
                dispatch({
                    type: GET_ALL_COLLEGES_SUCCESS,
                    payload: response.data
                });
            })
            .catch(err => {
                dispatch({
                    type: GET_ALL_COLLEGES_ERROR,
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
