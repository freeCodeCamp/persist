import { FILTER_STUDENT_SUCCESS, FILTER_STUDENT_ERROR, FILTER_STUDENT_PENDING, FILTER_STUDENT_RESET } from '../actions/types';

export default function(state={ pending: false, success: false, error: false, students: [] }, action) {

	switch (action.type) {
		case FILTER_STUDENT_PENDING: 
			return { 
				...state, 
				pending: true 
			};
		case FILTER_STUDENT_SUCCESS: 
			return { 
				...state, 
				pending: false,
				success: true,
				students: action.payload
			};
		case FILTER_STUDENT_ERROR: 
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