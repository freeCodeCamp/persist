import {
    LOGIN_PENDING,
    LOGIN_SUCCESS,
    FORGOT_PASSWORD_PENDING,
    FORGOT_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_PENDING,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_USER_NAME_SUCCESS
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
        case UPDATE_USER_NAME_SUCCESS:
            let user = Object.assign({}, state.user);
            user.firstName = action.firstName;
            user.lastName = action.lastName;
            return {
                ...state,
                user: user
            }
        default:
            return state;
    }
};

export default authReducer;
