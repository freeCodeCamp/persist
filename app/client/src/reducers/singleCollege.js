import { GET_COLLEGE_SUCCESS, GET_COLLEGE_ERROR, GET_COLLEGE_PENDING, GET_COLLEGE_RESET } from '../actions/types';

export default function(state = { pending: false, success: false, error: false, college: null }, action) {
    switch (action.type) {
        case GET_COLLEGE_PENDING:
            return {
                ...state,
                college: null,
                pending: true
            };
        case GET_COLLEGE_SUCCESS:
            return {
                ...state,
                pending: false,
                success: true,
                college: action.payload
            };
        case GET_COLLEGE_ERROR:
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
