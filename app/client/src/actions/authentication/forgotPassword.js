import axios from 'axios';
import { FORGOT_PASSWORD_PENDING, FORGOT_PASSWORD_SUCCESS } from '../types';

const getForgotPasswordToken = ({ email }) =>
    dispatch => {
        dispatch({
            type: FORGOT_PASSWORD_PENDING
        });
        // FIXME Needs to handle 404 or other failed status.  Unit test fails presently because
        // there is no callback for a failure, causing unit test to time out waiting for response.
        return axios.post('/forgot-password', { email }).then(response => {
            dispatch({
                type: FORGOT_PASSWORD_SUCCESS
            });
            return response;
        });
    };

export default getForgotPasswordToken;
