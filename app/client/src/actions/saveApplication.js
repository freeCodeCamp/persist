import {
    SAVE_APPLICATION_ERROR,
    SAVE_APPLICATION_PENDING,
    SAVE_APPLICATION_SUCCESS,
    SPINNER
} from './types';
import {axios} from './utils';

const saveApplication = (application) => (
    (dispatch) => {
        dispatch({
            type: SPINNER,
            payload: true
        });
        return axios().post('/update-application', {application})
            .then((res) => {
                dispatch({
                    type: SAVE_APPLICATION_SUCCESS,
                    payload: res.data,
                    osis: application.osis
                });
                dispatch({
                    type: SPINNER,
                    payload: false
                });
            })
            .catch((err) => {
                dispatch({
                    type: SAVE_APPLICATION_ERROR,
                    payload: err
                });
                dispatch({
                    type: SPINNER,
                    payload: false
                })
            });
    }
);

export default saveApplication;
