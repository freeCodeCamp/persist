import { GET_SCHOOLS_SUCCESS, GET_SCHOOLS_ERROR, GET_SCHOOLS_PENDING } from '../actions/types';

export default function(state = {
    pending: false,
    success: false,
    error: false,
    schools: []
  } , action) {

  switch (action.type) {
    case GET_SCHOOLS_PENDING:
      return {
        ...state,
        pending: true
      };
    case GET_SCHOOLS_SUCCESS:
      return {
        ...state,
        pending: false,
        success: true,
        schools: action.payload
      };
    case GET_SCHOOLS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.payload
      };
    default:
      return state;
  }
}