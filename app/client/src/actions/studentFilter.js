import { FILTER_STUDENT_SUCCESS, FILTER_STUDENT_ERROR, FILTER_STUDENT_PENDING } from './types';
import axios from 'axios';

export function filterStudents(queryObject) {
  
  return function(dispatch) {

    dispatch({
      type: FILTER_STUDENT_PENDING
    });
    return axios.get('/api/students', {
      params: queryObject
    })
      .then((response) => {
        dispatch({
          type: FILTER_STUDENT_SUCCESS,
          payload: response.data
        });
      }).catch((err) => {
      dispatch({
        type: FILTER_STUDENT_ERROR,
        payload: err
      });
    });
  };
}
