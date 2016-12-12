import axios from 'axios';
import {FORGOT_PASSWORD_PENDING, FORGOT_PASSWORD_SUCCESS} from './types';

const getForgotPasswordToken = ({email}) => (
    (dispatch) => {
        dispatch({
            type: FORGOT_PASSWORD_PENDING
        });
        return axios.post('/forgot-password', {email})
            .then((response) => {
                dispatch({
                    type: FORGOT_PASSWORD_SUCCESS
                });
                return response;
            });
    }
);

export default getForgotPasswordToken;
