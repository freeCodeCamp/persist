import {UPDATE_STUDENT, UPDATE_STUDENT_SUCCESS, UPDATE_STUDENT_ERROR, UPDATE_STUDENT_PENDING, UPDATE_STUDENT_RESET} from './types';
import {axios} from './utils';

export function updateStudent(studentRecord) {

    return function (dispatch) {

        dispatch({
            type: UPDATE_STUDENT_PENDING
        });

        return axios().put('/api/student/' + studentRecord.osis, studentRecord)
            .then((response) => {
                    dispatch({
                        type: UPDATE_STUDENT_SUCCESS,
                        payload: response.data
                    });
                    dispatch({
                        type: UPDATE_STUDENT,
                        payload: response.data
                    });
            }).catch((err) => {
                console.log(err);
                dispatch({
                    type: UPDATE_STUDENT_ERROR,
                    payload: err
                });
                dispatch({
                    type: UPDATE_STUDENT_RESET
                });
            });
    };
}
