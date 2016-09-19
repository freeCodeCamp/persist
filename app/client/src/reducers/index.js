import { combineReducers } from 'redux';
import commentsReducer from './comments';
import uploadReducer from './upload';
import { routerReducer } from 'react-router-redux';

const rootReducer = combineReducers({
  comments: commentsReducer,
  routing: routerReducer,
  upload: uploadReducer
});

export default rootReducer;
