import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'

import commentsReducer from './comments';
import uploadReducer from './upload';
import singleStudentReducer from './singleStudent';
import singleCollegeReducer from './singleCollege';
import studentFilterReducer from './studentFilter';
import collegeFilterReducer from './collegeFilter';

const rootReducer = combineReducers({
  comments: commentsReducer,
  routing: routerReducer,
  upload: uploadReducer,
  singleStudent: singleStudentReducer,
  singleCollege: singleCollegeReducer,
  form: formReducer,
  studentFilter: studentFilterReducer,
  collegeFilter: collegeFilterReducer
});

export default rootReducer;
