import {GET_NOTIFICATIONS} from '../types';
import {axios} from '../utils';

const getNotifications = (offset, limit) => {
    return (dispatch) => {
        return axios().post('/notifications', {offset, limit})
            .then((response) => {
                dispatch({
                    type: GET_NOTIFICATIONS,
                    payload: response.data
                });
                return response.data;
            })
            .catch((err) => {
                console.log(err);
                return err;
            })
    }
};

export default getNotifications;
