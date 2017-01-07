import keyBy from 'lodash/keyBy';
import {
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_ERROR,
    GET_ALL_USERS_PENDING
} from '../actions/types';

export default function (state = {
    pending: false,
    success: false,
    error: false,
    idObj: {}
}, action) {

    switch (action.type) {
        case GET_ALL_USERS_PENDING:
            return {
                ...state,
                pending: true
            };
        case GET_ALL_USERS_SUCCESS:
            return {
                ...state,
                pending: false,
                success: true,
                idObj: keyBy(action.payload, '_id')
            };
        case GET_ALL_USERS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.payload
            };
        default:
            return state;
    }
}
