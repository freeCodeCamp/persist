import {GET_ALL_SCHOOLS_ERROR, GET_ALL_SCHOOLS_PENDING, GET_ALL_SCHOOLS_SUCCESS} from './types';
import {axios} from './utils';

export default () => {
  return (dispatch) => {
    dispatch({
      type: GET_ALL_SCHOOLS_PENDING
    });

    return axios().get('/api/schools')
      .then((response) => {
        dispatch({
          type: GET_ALL_SCHOOLS_SUCCESS,
          payload: response.data
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_ALL_SCHOOLS_ERROR,
          payload: err
        });
      })
  }
};
