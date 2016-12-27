import {
    UPDATE_NOTIFICATIONS,
    GET_NOTIFICATIONS,
    MARK_READ_NOTIFICATION,
    MARK_READ_ALL_NOTIFICATION
}  from '../actions/types';
import cloneDeep from 'lodash/cloneDeep';

const defaultState = {
    lastAllRead: new Date(),
    unread: 0,
    value: []
};

const unreadNot = (notifications, lastAllRead) => {
    let unread = 0;
    if (!lastAllRead) {
        for (let notification of notifications) {
            if (!notification.read) unread++;
        }
        return unread;
    }
    for (let notification of notifications) {
        if (notification.notifId.createdAt > lastAllRead) {
            if (!notification.read) unread++;
            continue;
        }
        return unread;
    }
    return unread;
};

const notificationsReducer = (state = defaultState, action) => {
    let notifications, lastAllRead, newState, value, unread;
    switch (action.type) {
        case GET_NOTIFICATIONS:
            notifications = action.payload.notifications;
            lastAllRead = action.payload.lastAllRead;
            value = [...state.value, ...notifications];
            unread = unreadNot(value, lastAllRead);
            return {
                lastAllRead,
                value,
                unread
            };
        case MARK_READ_ALL_NOTIFICATION:
            lastAllRead = action.payload.lastAllRead;
            return {
                ...state,
                lastAllRead,
                unread: 0
            };
        case MARK_READ_NOTIFICATION:
            newState = cloneDeep(state);
            newState.value.forEach((notification) => {
                if (notification.notifId._id === action.payload) {
                    notification.read = true;
                    newState.unread--;
                }
            });
            return newState;
        case UPDATE_NOTIFICATIONS:
            return {
                ...state,
                unread: state.unread + 1,
                value: [action.payload, ...state.value]
            };
        default:
            return state;
    }
};

export default notificationsReducer;
