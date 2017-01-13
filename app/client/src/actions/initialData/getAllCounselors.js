import {GET_ALL_USERS_ERROR, GET_ALL_USERS_PENDING, GET_ALL_USERS_SUCCESS} from '../types';
import {axios} from '../utils';

export default () => {
    return (dispatch) => {
        dispatch({
            type: GET_ALL_USERS_PENDING
        });

        return axios().get('/api/users')
            .then((response) => {
                dispatch({
                    type: GET_ALL_USERS_SUCCESS,
                    payload: response.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: GET_ALL_USERS_ERROR,
                    payload: err
                });
                return err;
            })
    }
};
