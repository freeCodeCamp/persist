import { GET_STUDENT_SUCCESS, GET_STUDENT_ERROR, GET_STUDENT_PENDING } from '../actions/types';

export default function(state={ pending: false, success: false, error: false, student: null }, action) {

	switch (action.type) {
		case GET_STUDENT_PENDING: 
			return { 
				...state, 
				student: null,
				pending: true 
			};
		case GET_STUDENT_SUCCESS: 
			return { 
				...state, 
				pending: false,
				success: true,
				student: action.payload
			};
		case GET_STUDENT_ERROR: 
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