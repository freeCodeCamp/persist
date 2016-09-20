import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'

import commentsReducer from './comments';
import uploadReducer from './upload';
import singleStudentReducer from './singleStudent';

const rootReducer = combineReducers({
  comments: commentsReducer,
  routing: routerReducer,
  upload: uploadReducer,
  singleStudent: singleStudentReducer,
  form: formReducer 
});

export default rootReducer;
