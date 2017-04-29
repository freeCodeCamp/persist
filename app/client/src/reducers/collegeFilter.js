import { FILTER_COLLEGE_SUCCESS, FILTER_COLLEGE_ERROR, FILTER_COLLEGE_PENDING, FILTER_COLLEGE_RESET } from '../actions/types';

export default function(state = { pending: false, success: false, error: false, colleges: [] }, action) {
    switch (action.type) {
        case FILTER_COLLEGE_PENDING:
            return {
                ...state,
                pending: true
            };
        case FILTER_COLLEGE_SUCCESS:
            return {
                ...state,
                pending: false,
                success: true,
                colleges: action.payload
            };
        case FILTER_COLLEGE_ERROR:
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
