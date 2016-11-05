import { CHART_FILTER_SUCCESS, CHART_FILTER_ERROR, CHART_FILTER_PENDING } from './types';
import axios from 'axios';

export function chartFilter(queryObject) {
  return function(dispatch) {

    dispatch({
      type:  CHART_FILTER_PENDING
    });
    return axios.get('/api/students', {
      params: queryObject
    })
      .then((response) => {
        console.log(response)
        dispatch({
          type: CHART_FILTER_SUCCESS,
          payload: response.data
        });
      }).catch((err) => {
      dispatch({
        type: CHART_FILTER_ERROR,
        payload: err
      });
    });
  };
}
