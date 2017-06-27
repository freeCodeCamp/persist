import { UPDATE_NOTIFICATIONS } from '../types';

const updateNotification = notification => dispatch => {
    dispatch({
        type: UPDATE_NOTIFICATIONS,
        payload: notification
    });
};

export default updateNotification;
