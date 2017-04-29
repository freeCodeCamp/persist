import { ALL_REMINDERS, REMOVE_REMINDER, ADD_REMINDER } from '../actions/types';
import sortBy from 'lodash/sortBy';

const defaultState = [];

const remindersReducer = (state = defaultState, action) => {
    switch (action.type) {
        case ALL_REMINDERS:
            return sortBy(action.payload, caseNote => {
                return caseNote.date;
            }).reverse();
        case REMOVE_REMINDER:
            return state.filter(caseNote => caseNote._id !== action.payload);
        case ADD_REMINDER:
            return [action.payload, ...state.filter(caseNote => caseNote._id === action.payload._id)];
        default:
            return state;
    }
};

export default remindersReducer;
