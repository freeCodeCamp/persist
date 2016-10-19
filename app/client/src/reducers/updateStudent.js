import { UPDATE_STUDENT_SUCCESS, UPDATE_STUDENT_ERROR, UPDATE_STUDENT_PENDING} from '../actions/types';

export default function(state={ pending: false, success: false, error: false, student: null }, action) {

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
		default: 
			return state;
	}

	return state;

}