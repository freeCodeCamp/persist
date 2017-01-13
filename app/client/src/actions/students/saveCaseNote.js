import {
    SAVE_CASE_NOTE_ERROR,
    SAVE_CASE_NOTE_PENDING,
    SAVE_CASE_NOTE_SUCCESS,
    SPINNER
} from '../types';
import {axios} from '../utils';

const saveCaseNote = (caseNote) => (
    (dispatch) => {
        dispatch({
            type: SPINNER,
            payload: true
        });
        return axios().post('/update-caseNote', {caseNote})
            .then((res) => {
                dispatch({
                    type: SAVE_CASE_NOTE_SUCCESS,
                    payload: res.data,
                    osis: caseNote.osis
                });
                dispatch({
                    type: SPINNER,
                    payload: false
                });
            })
            .catch((err) => {
                dispatch({
                    type: SAVE_CASE_NOTE_ERROR,
                    payload: err
                });
                dispatch({
                    type: SPINNER,
                    payload: false
                })
            });
    }
);

export default saveCaseNote;
