import {
    UPDATE_NOTIFICATIONS
}  from '../actions/types';

const defaultState = [];

const notificationsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case UPDATE_NOTIFICATIONS:
            return [action.payload, ...state];
        default:
            return state;
    }
};

export default notificationsReducer;
