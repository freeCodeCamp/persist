import { UPLOAD_FILE_SUCCESS, UPLOAD_FILE_ERROR, UPLOAD_FILE_PENDING, UPLOAD_FILE_RESET } from './types';
import axios from 'axios';

export function uploadFile(url, file) {
	
	return function(dispatch) {

		// compose formdata
		var data = new FormData();
    	data.append('file', file);
    	// start action flow
    	dispatch({ type: UPLOAD_FILE_PENDING });

		axios.post(url, data)
			.then((response) => {
				const message = 'You added ' + response.data.addedCount + ' and modified ' + response.data.modifiedCount;
				dispatch({ type: UPLOAD_FILE_SUCCESS, payload: message });
				
			})
			.catch((err) => {
				dispatch({ type: UPLOAD_FILE_ERROR, payload: err });
			});

	};

}