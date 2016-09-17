import { combineReducers } from 'redux';
import commentsReducer from './comments';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  comments: commentsReducer,
  routing: routerReducer
});

export default rootReducer;
