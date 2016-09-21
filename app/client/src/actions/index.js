import { UPLOAD_FILE_SUCCESS, UPLOAD_FILE_ERROR, UPLOAD_FILE_PENDING, UPLOAD_FILE_RESET } from './types';
import { GET_STUDENT_SUCCESS, GET_STUDENT_ERROR, GET_STUDENT_PENDING, GET_STUDENT_RESET } from './types';
import axios from 'axios';

export function uploadFile(file) {
	
	return function(dispatch) {

		// compose formdata
		var data = new FormData();
    	data.append('file', file);

    	// start action flow
    	dispatch({ type: UPLOAD_FILE_PENDING });

		axios.post('/upload', data)
			.then((response) => {
				console.log(response);

				const message = 'You added ' + response.data.addedCount + ' and modified ' + response.data.modifiedCount;

				dispatch({ type: UPLOAD_FILE_SUCCESS, payload: message });
				
			})
			.catch((err) => {
				dispatch({ type: UPLOAD_FILE_ERROR, payload: err });
				
			});

	};

}

export function getStudent(contactID) {

		return function(dispatch) {

			dispatch({type: GET_STUDENT_PENDING});
			axios.get('/api/student/' + contactID)
	            .then((response) => {
	                console.log(response.data);
	                dispatch({type: GET_STUDENT_SUCCESS, payload: response.data[0]});
	            }).catch((err) => {
	                 dispatch({type: GET_STUDENT_ERROR, payload: err});
	            });
		};


	}
	
