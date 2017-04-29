import { UPLOAD_FILE_SUCCESS, UPLOAD_FILE_ERROR, UPLOAD_FILE_PENDING, UPLOAD_FILE_RESET, SPINNER_PAGE } from './types';
import { axios } from './utils';

export function uploadFile(url, file) {
    return function(dispatch) {
        // load SPINNER_PAGE
        dispatch({
            type: SPINNER_PAGE,
            payload: true
        });

        // compose formdata
        var data = new FormData();
        data.append('file', file);

        return axios()
            .post(url, data)
            .then(response => {
                const message = 'You added ' + response.data.addedCount + ' and modified ' + response.data.modifiedCount;
                const newStudents = response.data.newStudents;
                const updatedStudents = response.data.updatedStudents;

                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
                dispatch({
                    type: UPLOAD_FILE_SUCCESS,
                    payload: { message, newStudents, updatedStudents }
                });
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
                dispatch({
                    type: UPLOAD_FILE_ERROR,
                    payload: 'Error Found'
                });
            });
    };
}
