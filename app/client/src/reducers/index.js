import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import uploadReducer from './upload';
import singleStudentReducer from './singleStudent';
import singleCollegeReducer from './singleCollege';
import studentFilterReducer from './studentFilter';
import collegeFilterReducer from './collegeFilter';
import spinnerReducer from './spinner';
import schoolReducer from './schools';
import suggestionsReducer from './suggestions';
import updateStudentReducer from './updateStudent';
import chartFilter from './chartFilter';

const rootReducer = combineReducers({
  routing: routerReducer,
  upload: uploadReducer,
  singleStudent: singleStudentReducer,
  singleCollege: singleCollegeReducer,
  form: formReducer,
  studentFilter: studentFilterReducer,
  collegeFilter: collegeFilterReducer,
  spinner: spinnerReducer,
  schools: schoolReducer,
  suggestions: suggestionsReducer,
  updateStudent: updateStudentReducer,
  chartFilter: chartFilter
});

export default rootReducer;
