import { FILTER_COLLEGE_SUCCESS, FILTER_COLLEGE_ERROR, FILTER_COLLEGE_PENDING } from './types';
import axios from 'axios';

export function filterColleges(queryObject) {

		console.log('action object', queryObject)
		return function(dispatch) {

			dispatch({type: FILTER_COLLEGE_PENDING});
			axios.get('/api/colleges', {params: queryObject})
	            .then((response) => {
	                console.log(response.data);
	                dispatch({type: FILTER_COLLEGE_SUCCESS, payload: response.data});
	            }).catch((err) => {
	            	console.log(err);
	                 dispatch({type: FILTER_COLLEGE_ERROR, payload: err});
	            });
		};
}
	