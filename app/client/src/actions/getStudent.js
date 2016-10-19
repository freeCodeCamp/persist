import { GET_STUDENT_SUCCESS, GET_STUDENT_ERROR, GET_STUDENT_PENDING, GET_STUDENT_RESET } from './types';
import axios from 'axios';

export function getStudent(osis) {

  return function(dispatch) {

    dispatch({
      type: GET_STUDENT_PENDING
    });
    return axios.get('/api/student/' + osis)
      .then((response) => {
        dispatch({
          type: GET_STUDENT_SUCCESS,
          payload: response.data
        });
      }).catch((err) => {
      dispatch({
        type: GET_STUDENT_ERROR,
        payload: err
      });
    });
  };
}
