import { GET_SUGGESTIONS } from '../actions/types';

const defaultState = [];

export default function(state = defaultState, action) {
    switch (action.type) {
        case GET_SUGGESTIONS:
            return action.payload;
        default:
            return state;
    }
}
