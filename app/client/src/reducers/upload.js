import { UPLOAD_FILE_SUCCESS, UPLOAD_FILE_ERROR, UPLOAD_FILE_PENDING, UPLOAD_FILE_RESET } from '../actions/types';

const defaultState = {
  message: null
};

export default function(state = defaultState, action) {

  switch (action.type) {
    case UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        message: action.payload
      };
    case UPLOAD_FILE_ERROR:
      return {
        ...state,
        message: action.payload
      };
    case UPLOAD_FILE_RESET:
      return defaultState;
    default:
      return state;
  }

}