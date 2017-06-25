import { UPDATE_USER_NAME_ERROR, UPDATE_USER_NAME_PENDING, UPDATE_USER_NAME_SUCCESS, SPINNER_PAGE, CLOSE_NAME_EDIT } from './types';
import { axios } from './utils';

const updateUserName = (firstName, lastName) => (
  dispatch => {
    console.log('second')
    dispatch({
      type: SPINNER_PAGE,
      payload: true
    });
    dispatch({
      type: CLOSE_NAME_EDIT
    });
    return axios()
      .patch('/user_name', {
        firstName: firstName,
        lastName: lastName
      })
      .then(() => {
        console.log('third')
        dispatch({
          type: UPDATE_USER_NAME_SUCCESS,
          firstName: firstName,
          lastName: lastName
        });
        dispatch({
          type: SPINNER_PAGE,
          payload: false
        });
        dispatch({
          type: CLOSE_NAME_EDIT
        });
      })
      .catch(err => {
        dispatch({
          type: UPDATE_USER_NAME_ERROR,
          payload: err
        });
        dispatch({
          type: SPINNER_PAGE,
          payload: false
        });
      });
  }
);



export default updateUserName;
