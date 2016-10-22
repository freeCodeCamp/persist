import { SPINNER } from '../actions/types';

const defaultState = false;

export default function(state = defaultState, action) {
  switch (action.type) {
    case SPINNER:
      return action.payload;
    default:
      return state;
  }

}