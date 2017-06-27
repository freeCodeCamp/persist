import { DELETE_ALIAS_ERROR, DELETE_ALIAS_PENDING, DELETE_ALIAS_SUCCESS, SPINNER_PAGE } from '../types';
import { axios } from '../utils';

const deleteAlias = (osis, _id) => dispatch => {
    dispatch({
        type: SPINNER_PAGE,
        payload: true
    });
    const params = {
        osis,
        _id
    };
    return axios()
        .delete('/update-alias', { params })
        .then(res => {
            dispatch({
                type: DELETE_ALIAS_SUCCESS,
                osis,
                _id
            });
            dispatch({
                type: SPINNER_PAGE,
                payload: false
            });
        })
        .catch(err => {
            dispatch({
                type: DELETE_ALIAS_ERROR,
                payload: err
            });
            dispatch({
                type: SPINNER_PAGE,
                payload: false
            });
        });
};

export default deleteAlias;
