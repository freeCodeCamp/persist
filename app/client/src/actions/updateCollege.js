import { UPDATE_COLLEGE_SUCCESS, UPDATE_COLLEGE_ERROR, UPDATE_COLLEGE_PENDING, UPDATE_COLLEGE_RESET } from './types';
import {axios} from './utils';

export function updateCollege(collegeRecord) {
    console.log('getting to action', collegeRecord)
    return function(dispatch) {

        dispatch({
            type: UPDATE_COLLEGE_PENDING
        });

        return axios().put('/api/college/' + collegeRecord.fullName, collegeRecord)
            .then((response) => {
                console.log(response);
                setTimeout(function() {
                    dispatch({
                        type: UPDATE_COLLEGE_RESET
                    });
                }, 5000);
                if (response.data.err) {
                    dispatch({
                        type: UPDATE_COLLEGE_ERROR,
                        payload: 'We had a problem updating the record, please check the form for errors.'
                    });
                } else {
                    dispatch({
                        type: UPDATE_COLLEGE_SUCCESS,
                        payload: response.data
                    });
                }
            }).catch((err) => {
              console.log(err)
              dispatch({
                  type: UPDATE_COLLEGE_ERROR,
                  payload: err
              });
              setTimeout(function() {
                  dispatch({
                      type: UPDATE_COLLEGE_RESET
                  });
              }, 5000);
        });
    };
}
