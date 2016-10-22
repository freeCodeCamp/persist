import { UPDATE_STUDENT_SUCCESS, UPDATE_STUDENT_ERROR, UPDATE_STUDENT_PENDING, UPDATE_STUDENT_RESET } from '../actions/types';

const initialState = { pending: false, success: false, error: false, student: null }

export default function(state=initialState, action) {

	switch (action.type) {
		case UPDATE_STUDENT_PENDING: 
			return { 
				...state, 
				pending: true 
			};
		case UPDATE_STUDENT_SUCCESS: 
			return { 
				...state, 
				pending: false,
				success: true,
				student: action.payload
			};
		case UPDATE_STUDENT_ERROR: 
			return { 
				...state, 
				pending: false,
				error: action.payload 
			};
		case UPDATE_STUDENT_RESET: 
			return initialState;
		default: 
			return state;
	}

	return state;

}