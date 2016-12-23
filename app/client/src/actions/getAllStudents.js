import {GET_ALL_STUDENTS_ERROR, GET_ALL_STUDENTS_PENDING, GET_ALL_STUDENTS_SUCCESS} from './types';
import {axios} from './utils';

export default () => {
    return (dispatch) => {
        dispatch({
            type: GET_ALL_STUDENTS_PENDING
        });

        return axios().get('/api/students')
            .then((response) => {
                dispatch({
                    type: GET_ALL_STUDENTS_SUCCESS,
                    payload: response.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: GET_ALL_STUDENTS_ERROR,
                    payload: err
                });
                return err;
            })
    }
};
