import { FILTER_COLLEGE_SUCCESS, FILTER_COLLEGE_ERROR, FILTER_COLLEGE_PENDING } from './types';
import axios from 'axios';

export function filterColleges(queryObject) {

		
		return function(dispatch) {

			dispatch({type: FILTER_COLLEGE_PENDING});
			return axios.get('/api/colleges', {params: queryObject})
	            .then((response) => {
	              
	                dispatch({type: FILTER_COLLEGE_SUCCESS, payload: response.data});
	            }).catch((err) => {
	            	
	                 dispatch({type: FILTER_COLLEGE_ERROR, payload: err});
	            });
		};
}
	