import { SAVE_ALIAS_ERROR, SAVE_ALIAS_PENDING, SAVE_ALIAS_SUCCESS, SPINNER_PAGE } from '../types';
import { axios } from '../utils';

const saveAlias = alias => dispatch => {
    dispatch({
        type: SPINNER_PAGE,
        payload: true
    });
    return axios()
        .post('/update-alias', { alias })
        .then(res => {
            dispatch({
                type: SAVE_ALIAS_SUCCESS,
                payload: res.data,
                osis: alias.osis
            });
            dispatch({
                type: SPINNER_PAGE,
                payload: false
            });
        })
        .catch(err => {
            dispatch({
                type: SAVE_ALIAS_ERROR,
                payload: err
            });
            dispatch({
                type: SPINNER_PAGE,
                payload: false
            });
        });
};

export default saveAlias;
