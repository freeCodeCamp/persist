import {
    DELETE_USER_ERROR,
    DELETE_USER_PENDING,
    DELETE_USER_SUCCESS,
    SPINNER
} from './types';
import {axios} from './utils';

const deleteUser = (user) => (
    (dispatch) => {
        dispatch({
            type: SPINNER,
            payload: true
        });
        const params = {
            _id: user._id
        };
        return axios().delete('/users', {params})
            .then(() => {
                dispatch({
                    type: DELETE_USER_SUCCESS,
                    payload: user
                });
                dispatch({
                    type: SPINNER,
                    payload: false
                });
            })
            .catch((err) => {
                dispatch({
                    type: DELETE_USER_ERROR,
                    payload: err
                });
                dispatch({
                    type: SPINNER,
                    payload: false
                });
            })
    }
);

export default deleteUser;
