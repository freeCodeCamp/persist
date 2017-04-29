import { DELETE_TERM_ERROR, DELETE_TERM_PENDING, DELETE_TERM_SUCCESS, SPINNER_PAGE } from '../types';
import { axios } from '../utils';

const deleteTerm = (osis, _id) =>
    dispatch => {
        dispatch({
            type: SPINNER_PAGE,
            payload: true
        });
        const params = {
            osis,
            _id
        };
        return axios()
            .delete('/update-term', { params })
            .then(res => {
                dispatch({
                    type: DELETE_TERM_SUCCESS,
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
                    type: DELETE_TERM_ERROR,
                    payload: err
                });
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
            });
    };

export default deleteTerm;
