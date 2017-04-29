import { DELETE_APPLICATION_ERROR, DELETE_APPLICATION_PENDING, DELETE_APPLICATION_SUCCESS, SPINNER_PAGE } from '../types';
import { axios } from '../utils';

const deleteApplication = (osis, _id) =>
    dispatch => {
        dispatch({
            type: SPINNER_PAGE,
            payload: true
        });
        const params = {
            osis,
            _id
        };
        return axios()
            .delete('/update-application', { params })
            .then(res => {
                dispatch({
                    type: DELETE_APPLICATION_SUCCESS,
                    osis,
                    _id
                });
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
            })
            .catch(err => {
                dispatch({
                    type: DELETE_APPLICATION_ERROR,
                    payload: err
                });
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
            });
    };

export default deleteApplication;
