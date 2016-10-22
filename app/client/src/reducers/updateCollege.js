import { UPDATE_COLLEGE_SUCCESS, UPDATE_COLLEGE_ERROR, UPDATE_COLLEGE_PENDING, UPDATE_COLLEGE_RESET} from '../actions/types';

const initialState = { pending: false, success: false, error: false, college: null }

export default function(state=initialState, action) {

	switch (action.type) {
		case UPDATE_COLLEGE_PENDING: 
			return { 
				...state, 
				pending: true 
			};
		case UPDATE_COLLEGE_SUCCESS: 
			return { 
				...state, 
				pending: false,
				success: true,
				college: action.payload
			};
		case UPDATE_COLLEGE_ERROR: 
			return { 
				...state, 
				pending: false,
				error: action.payload 
			};
		case UPDATE_COLLEGE_RESET: 
			return initialState;
		default: 
			return state;
	}

	return state;

}