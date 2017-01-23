import {
    DELETE_CASE_NOTE_ERROR,
    DELETE_CASE_NOTE_PENDING,
    DELETE_CASE_NOTE_SUCCESS,
    SPINNER_PAGE
} from '../types';
import {axios} from '../utils';

const deleteCaseNote = (osis, _id) => (
    (dispatch) => {
        dispatch({
            type: SPINNER_PAGE,
            payload: true
        });
        const params = {
            osis,
            _id
        };
        return axios().delete('/update-caseNote', {params})
            .then((res) => {
                dispatch({
                    type: DELETE_CASE_NOTE_SUCCESS,
                    osis,
                    _id
                });
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
            })
            .catch((err) => {
                dispatch({
                    type: DELETE_CASE_NOTE_ERROR,
                    payload: err
                });
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
            });
    }
);

export default deleteCaseNote;
