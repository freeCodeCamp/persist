import { GET_SUGGESTIONS } from './types';
import axios from 'axios';

export const getSuggestions = (columnName, value) => {
  return (dispatch) => {
    if (value.length < 3) {
      return dispatch({
        type: GET_SUGGESTIONS,
        payload: []
      });
    }
    let data = {
      columnName,
      value
    };
    return axios.post('/suggestions', data)
      .then((response) => {
        dispatch({
          type: GET_SUGGESTIONS,
          payload: response.data
        });
      });
  };
};