import { UPDATE_STUDENT_SUCCESS, UPDATE_STUDENT_ERROR, UPDATE_STUDENT_PENDING } from './types';
import axios from 'axios';

export function updateStudent(studentRecord) {

  return function(dispatch) {

    dispatch({
      type: UPDATE_STUDENT_PENDING
    });

    console.log(studentRecord)
    return axios.put('/api/student/' + studentRecord.osis, studentRecord)
      .then((response) => {
        console.log(response)
        dispatch({
          type: UPDATE_STUDENT_SUCCESS,
          payload: response.data
        });
      }).catch((err) => {
        console.log(err)
      dispatch({
        type: UPDATE_STUDENT_ERROR,
        payload: err
      });
    });
  };
}
