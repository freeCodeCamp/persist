import { GET_COLLEGE_SUCCESS, GET_COLLEGE_ERROR, GET_COLLEGE_PENDING, GET_COLLEGE_RESET } from './types';
import axios from 'axios';

export function getCollege(fullName) {

		return function(dispatch) {

			dispatch({type: GET_COLLEGE_PENDING});
			axios.get('/api/college/' + fullName)
	            .then((response) => {
	                console.log(response.data);
	                dispatch({type: GET_COLLEGE_SUCCESS, payload: response.data[0]});
	            }).catch((err) => {
	                 dispatch({type: GET_COLLEGE_ERROR, payload: err});
	            });
		};
}
	