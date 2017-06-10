import { REMOVE_REMINDER } from '../types';

const removeReminder = _id => dispatch => {
    dispatch({
        type: REMOVE_REMINDER,
        payload: _id
    });
};

export default removeReminder;
