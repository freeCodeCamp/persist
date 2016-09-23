import { FILTER_STUDENT_SUCCESS, FILTER_STUDENT_ERROR, FILTER_STUDENT_PENDING } from './types';
import axios from 'axios';

export function filterStudents(queryObject) {

		console.log('action object', queryObject)
		return function(dispatch) {

			dispatch({type: FILTER_STUDENT_PENDING});
			axios.get('/api/students', {params: queryObject})
	            .then((response) => {
	                console.log(response.data);
	                dispatch({type: FILTER_STUDENT_SUCCESS, payload: response.data});
	            }).catch((err) => {
	            	console.log(err);
	                 dispatch({type: FILTER_STUDENT_ERROR, payload: err});
	            });
		};
}
	