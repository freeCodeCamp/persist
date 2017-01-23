import {SPINNER, SPINNER_PAGE} from '../actions/types';

const defaultState = {
    main: true,
    page: false
};

export default function (state = defaultState, action) {
    switch (action.type) {
        case SPINNER:
            return {
                ...state,
                main: action.payload
            };
        case SPINNER_PAGE:
            return {
                ...state,
                page: action.payload
            };
        default:
            return state;
    }
}
