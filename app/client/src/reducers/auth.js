import {
    LOGIN_PENDING,
    LOGIN_SUCCESS,
    FORGOT_PASSWORD_PENDING,
    FORGOT_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_PENDING,
    UPDATE_PASSWORD_SUCCESS
} from '../actions/types';

const defaultState = {
    authenticated: false,
    user: null,
    pending: false
};

const authReducer = (state = defaultState, action) => {
    switch (action.type) {
        case LOGIN_PENDING:
        case FORGOT_PASSWORD_PENDING:
        case UPDATE_PASSWORD_PENDING:
            return {
                ...state,
                pending: true
            };
        case LOGIN_SUCCESS:
            return {
                authenticated: true,
                pending: false,
                user: action.payload
            };
        case FORGOT_PASSWORD_SUCCESS:
        case UPDATE_PASSWORD_SUCCESS:
            return {
                ...state,
                pending: false
            };
        default:
            return state;
    }
};

export default authReducer;
