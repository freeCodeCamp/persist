import axios from 'axios';
import {UPDATE_PASSWORD_PENDING, UPDATE_PASSWORD_SUCCESS} from '../types';

const updatePassword = (token, {password}) => (
    (dispatch) => {
        dispatch({
            type: UPDATE_PASSWORD_PENDING
        });
        return axios.post(`/update-password/${token}`, {password})
            .then((response) => {
                dispatch({
                    type: UPDATE_PASSWORD_SUCCESS
                });
                return response;
            });
    }
);

export default updatePassword;
