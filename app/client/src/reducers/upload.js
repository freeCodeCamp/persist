import { UPLOAD_FILE_SUCCESS, UPLOAD_FILE_ERROR, UPLOAD_FILE_PENDING, UPLOAD_FILE_RESET } from '../actions/types';

export default function(state={ pending: false, success: false, error: false, message: null }, action) {

	switch(action.type) {
		case UPLOAD_FILE_PENDING: 
			return { 
				...state, 
				pending : true 
			}
		case UPLOAD_FILE_SUCCESS: 
			return { 
				...state, 
				pending : false,
				success: true,
				message: action.payload
			}
		case UPLOAD_FILE_ERROR: 
			return { 
				...state, 
				pending : false,
				error: action.payload 
			}
		case UPLOAD_FILE_RESET:
			return {
				...state,
				pending: false,
				success: false,
				error: false,
				message: null
			}
		default: 
			return state;
	}

	return state;

}