import {GET_ALL_COLLEGES_SUCCESS, GET_ALL_COLLEGES_ERROR, GET_ALL_COLLEGES_PENDING} from '../actions/types';

export default function (state = {
    pending: false,
    success: false,
    error: false,
    value: []
}, action) {

    switch (action.type) {
        case GET_ALL_COLLEGES_PENDING:
            return {
                ...state,
                pending: true
            };
        case GET_ALL_COLLEGES_SUCCESS:
            return {
                ...state,
                pending: false,
                success: true,
                value: action.payload
            };
        case GET_ALL_COLLEGES_ERROR:
            return {
                ...state,
                pending: false,
                error: action.payload
            };
        default:
            return state;
    }
}
