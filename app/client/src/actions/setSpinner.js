import { SPINNER } from './types';

export const setSpinner = (status) => {
  return (dispatch) => dispatch({
    type: SPINNER,
    payload: status
  });
};