import {
    SAVE_TERM_ERROR,
    SAVE_TERM_PENDING,
    SAVE_TERM_SUCCESS,
    SPINNER_PAGE
} from '../types';
import {axios} from '../utils';

const saveTerm = (term) => (
    (dispatch) => {
        dispatch({
            type: SPINNER_PAGE,
            payload: true
        });
        return axios().post('/update-term', {term})
            .then((res) => {
                dispatch({
                    type: SAVE_TERM_SUCCESS,
                    payload: res.data,
                    osis: term.osis
                });
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
            })
            .catch((err) => {
                dispatch({
                    type: SAVE_TERM_ERROR,
                    payload: err
                });
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                })
            });
    }
);

export default saveTerm;
