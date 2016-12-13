import {
    GET_USERS_PENDING,
    GET_USERS_ERROR,
    GET_USERS_SUCCESS
} from './types';
import {axios} from './utils';

const getUsers = () => (
    (dispatch) => {
        dispatch({
            type: GET_USERS_PENDING
        });
        axios().get('/users')
            .then((response) => {
                dispatch({
                    type: GET_USERS_SUCCESS,
                    payload: response.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: GET_USERS_ERROR,
                    payload: err
                });
            });
    }
);

export default getUsers;
