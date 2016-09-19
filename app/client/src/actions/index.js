import { UPLOAD_FILE_SUCCESS, UPLOAD_FILE_ERROR, UPLOAD_FILE_PENDING, UPLOAD_FILE_RESET } from './types';
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
				dispatch({ type: UPLOAD_FILE_SUCCESS });
				setTimeout(function() { dispatch({ type: UPLOAD_FILE_RESET }); }, 3000);
			})
			.catch((err) => {
				dispatch({ type: UPLOAD_FILE_ERROR, payload: err });
				setTimeout(function() { dispatch({ type: UPLOAD_FILE_RESET }); }, 10000);
			});

	};

}