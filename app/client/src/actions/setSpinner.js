import { SPINNER } from './types';

export const setSpinner = (status) => {
	console.log('SETTING SPINNER ACTION')
  return (dispatch) =>	 {
  	dispatch({
    type: SPINNER,
    payload: status
  });
  }
};