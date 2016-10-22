import { UPDATE_STUDENT_SUCCESS, UPDATE_STUDENT_ERROR, UPDATE_STUDENT_PENDING, UPDATE_STUDENT_RESET } from './types';
import axios from 'axios';

export function updateStudent(studentRecord) {

  return function(dispatch) {

    dispatch({
      type: UPDATE_STUDENT_PENDING
    });

    console.log(studentRecord)
    return axios.put('/api/student/' + studentRecord.osis, studentRecord)
      .then((response) => {
        console.log(response)

        setTimeout(function() {
                    dispatch({
                        type: UPDATE_STUDENT_RESET
                    });
                }, 5000);

        if (response.data.err) {
            dispatch({
            type: UPDATE_STUDENT_ERROR,
            payload: 'We had a problem while updating the data, please check the form for errors.'
          });
        }
        else {
          dispatch({
          type: UPDATE_STUDENT_SUCCESS,
          payload: response.data
        });
        }
       
      }).catch((err) => {
        console.log(err)
      dispatch({
        type: UPDATE_STUDENT_ERROR,
        payload: err
      });
      setTimeout(function() {
                    dispatch({
                        type: UPDATE_STUDENT_RESET
                    });
                }, 5000);
    });
  };
}
