import {
    INVITE_USER_ERROR,
    INVITE_USER_PENDING,
    INVITE_USER_SUCCESS,
    SPINNER
} from './types';
import {axios} from './utils';

const inviteUser = (user) => (
    (dispatch) => {
        dispatch({
            type: SPINNER,
            payload: true
        });
        return axios().post('/users', user)
            .then((res) => {
                dispatch({
                    type: INVITE_USER_SUCCESS,
                    payload: res.data
                });
                dispatch({
                    type: SPINNER,
                    payload: false
                });
            })
            .catch((err) => {
                dispatch({
                    type: INVITE_USER_ERROR,
                    payload: err
                });
                dispatch({
                    type: SPINNER,
                    payload: false
                });
            })
    }
);

export default inviteUser;
