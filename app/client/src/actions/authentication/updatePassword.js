import axios from 'axios';
import { UPDATE_PASSWORD_PENDING, UPDATE_PASSWORD_SUCCESS } from '../types';

const updatePassword = (token, { password }) =>
    dispatch => {
        dispatch({
            type: UPDATE_PASSWORD_PENDING
        });
        // FIXME Needs to handle 404 or other failed status.  Unit test fails presently because
        // there is no callback for a failure, causing unit test to time out waiting for response.
        return axios.post(`/update-password/${token}`, { password }).then(response => {
            dispatch({
                type: UPDATE_PASSWORD_SUCCESS
            });
            return response;
        });
    };

export default updatePassword;
