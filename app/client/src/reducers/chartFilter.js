import { CHART_FILTER_SUCCESS, CHART_FILTER_ERROR, CHART_FILTER_PENDING }  from '../actions/types';

export default function(state={ pending: false, success: false, error: false, students: [] }, action) {

	switch (action.type) {
		case CHART_FILTER_PENDING: 
			return { 
				...state, 
				pending: true 
			};
		case CHART_FILTER_SUCCESS: 
			return { 
				...state, 
				pending: false,
				success: true,
				students: action.payload
			};
		case CHART_FILTER_ERROR: 
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