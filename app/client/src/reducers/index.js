import {LOGOUT} from '../actions/types';
import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';

import uploadReducer from './upload';
import singleStudentReducer from './singleStudent';
import singleCollegeReducer from './singleCollege';
import studentFilterReducer from './studentFilter';
import collegeFilterReducer from './collegeFilter';
import spinnerReducer from './spinner';
import remindersReducer from './reminders';
import suggestionsReducer from './suggestions';
import updateStudentReducer from './updateStudent';
import chartFilter from './chartFilter';
import updateCollegeReducer from './updateCollege';
import allStudentsReducer from './allStudents';
import allCollegesReducer from './allColleges';
import allSchoolsReducer from './allSchools';
import allCounselorsReducer from './allCounselors';
import authReducer from './auth';
import usersReducer from './users'
import notificationsReducer from './notifications';

const appReducer = combineReducers({
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
    schools: allSchoolsReducer,
    auth: authReducer,
    users: usersReducer,
    counselors: allCounselorsReducer,
    reminders: remindersReducer,
    notifications: notificationsReducer
});

const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
