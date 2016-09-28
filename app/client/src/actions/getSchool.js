import { GET_SCHOOLS_SUCCESS, GET_SCHOOLS_ERROR, GET_SCHOOLS_PENDING } from './types';
import axios from 'axios';

export function getSchool() {

  return function(dispatch) {

    dispatch({
      type: GET_SCHOOLS_PENDING
    });
    return axios.get('/api/schools/')
      .then((response) => {
        console.log(response.data);
        dispatch({
          type: GET_SCHOOLS_SUCCESS,
          payload: response.data
        });
      }).catch((err) => {
      dispatch({
        type: GET_SCHOOLS_ERROR,
        payload: err
      });
    });
  };
}
