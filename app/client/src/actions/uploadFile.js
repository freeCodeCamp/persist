import { UPLOAD_FILE_SUCCESS, UPLOAD_FILE_ERROR, UPLOAD_FILE_PENDING, UPLOAD_FILE_RESET, SPINNER } from './types';
import axios from 'axios';

export function uploadFile(url, file) {

  return function(dispatch) {

    // load spinner
    dispatch({
      type: SPINNER,
      payload: true
    });

    // compose formdata
    var data = new FormData();
    data.append('file', file);

    return axios.post(url, data)
      .then((response) => {
        const message = 'You added ' + response.data.addedCount + ' and modified ' + response.data.modifiedCount;
        dispatch({
          type: SPINNER,
          payload: false
        });
        dispatch({
          type: UPLOAD_FILE_SUCCESS,
          payload: message
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: SPINNER,
          payload: false
        });
        dispatch({
          type: UPLOAD_FILE_ERROR,
          payload: 'Error Found'
        });
      });

  };

}