import {MARK_READ_ALL_NOTIFICATION} from './types';
import {axios} from './utils';

const markReadAll = () => {
    return (dispatch) => {
        return axios().get('/notifications/read/all',)
            .then((response) => {
                dispatch({
                    type: MARK_READ_ALL_NOTIFICATION,
                    payload: new Date()
                });
            })
            .catch((err) => {
                console.log(err);
                return err;
            })
    }
};

export default markReadAll;
