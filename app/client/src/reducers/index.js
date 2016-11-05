import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';

import uploadReducer from './upload';
import singleStudentReducer from './singleStudent';
import singleCollegeReducer from './singleCollege';
import studentFilterReducer from './studentFilter';
import collegeFilterReducer from './collegeFilter';
import spinnerReducer from './spinner';
import suggestionsReducer from './suggestions';
import updateStudentReducer from './updateStudent';
import chartFilter from './chartFilter';
import updateCollegeReducer from './updateCollege';
import allStudentsReducer from './allStudents';
import allCollegesReducer from './allColleges';
import allSchoolsReducer from './allSchools';

const rootReducer = combineReducers({
  routing: routerReducer,
  upload: uploadReducer,
  singleStudent: singleStudentReducer,
  singleCollege: singleCollegeReducer,
  form: formReducer,
  studentFilter: studentFilterReducer,
  collegeFilter: collegeFilterReducer,
  spinner: spinnerReducer,
  suggestions: suggestionsReducer,
  updateStudent: updateStudentReducer,
  updateCollege: updateCollegeReducer,
  chartFilter: chartFilter,
  students: allStudentsReducer,
  colleges: allCollegesReducer,
  schools: allSchoolsReducer
});

export default rootReducer;
