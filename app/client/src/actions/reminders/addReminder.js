import {
    ADD_REMINDER
} from '../types';

const addReminder = (caseNote) => (
    (dispatch) => {
        dispatch({
            type: ADD_REMINDER,
            payload: caseNote
        });
    }
);

export default addReminder;
