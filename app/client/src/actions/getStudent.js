import { GET_STUDENT_SUCCESS, GET_STUDENT_ERROR, GET_STUDENT_PENDING, GET_STUDENT_RESET } from './types';
import axios from 'axios';

export function getStudent(contactID) {

		return function(dispatch) {

			dispatch({type: GET_STUDENT_PENDING});
			axios.get('/api/student/' + contactID)
	            .then((response) => {
	                console.log(response.data);
	                dispatch({type: GET_STUDENT_SUCCESS, payload: response.data[0]});
	            }).catch((err) => {
	                 dispatch({type: GET_STUDENT_ERROR, payload: err});
	            });
		};
}
	