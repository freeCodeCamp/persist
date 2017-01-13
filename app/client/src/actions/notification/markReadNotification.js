import {MARK_READ_NOTIFICATION} from '../types';
import {axios} from '../utils';

const markRead = (notifId) => {
    return (dispatch) => {
        return axios().post('/notifications/read', {notifId})
            .then((response) => {
                dispatch({
                    type: MARK_READ_NOTIFICATION,
                    payload: notifId
                });
            })
            .catch((err) => {
                console.log(err);
                return err;
            })
    }
};

export default markRead;
