import {
    UPDATE_USER_ERROR,
    UPDATE_USER_PENDING,
    UPDATE_USER_SUCCESS,
    SPINNER
} from './types';
import {axios} from './utils';

const updateUser = (user) => (
    (dispatch) => {
        dispatch({
            type: SPINNER,
            payload: true
        });
        return axios().patch('/users', user)
            .then(() => {
                dispatch({
                    type: UPDATE_USER_SUCCESS,
                    payload: user
                });
                dispatch({
                    type: SPINNER,
                    payload: false
                });
            })
            .catch((err) => {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: err
                });
                dispatch({
                    type: SPINNER,
                    payload: false
                });
            })
    }
);

export default updateUser;
