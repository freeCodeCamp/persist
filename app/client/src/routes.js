import React from 'react';
import store from './store';
import { Route, IndexRoute } from 'react-router';
import AppParent from './components/AppParent';
import DashboardMain from './components/pages/DashboardMain';
import Upload from './components/pages/Upload';
import Schools from './components/pages/Schools';
import Students from './components/studentFilter/filter';
import InviteUsers from './components/pages/InviteUsers';
import SingleStudent from './components/pages/SingleStudent';
import SearchResult from './components/pages/SearchResult';
import SingleCollege from './components/pages/SingleCollege';
import Notifications from './components/pages/Notifications';
import Colleges from './components/pages/Colleges';
import Recovery from './components/pages/Recovery';
import FilteredStudents from './components/pages/FilteredStudents';
import { requireAuth, Login, ForgotPassword, UpdatePassword, logout } from './components/authentication';

export default (
    <Route>
        <Route path='login' component={Login} />
        <Route path='forgot-password' component={ForgotPassword} />
        <Route path='update-password/:token' component={UpdatePassword} />
        <Route path='invite/:token' component={UpdatePassword} />
        <Route path='logout' onEnter={logout.bind(null, store.dispatch)} />
        <Route path='/' component={ requireAuth(AppParent) }>
            <IndexRoute component={ DashboardMain } />
            <Route path='upload' component={ Upload } />
            <Route path='schools' component={ Schools } />
            <Route path='students' component={ Students } />
            <Route path='colleges' component={ Colleges } />
            <Route path='filtered' component={ FilteredStudents } />
            <Route path='student/:osis' component={ SingleStudent } />
            <Route path='invite-users' component={ InviteUsers } />
            <Route path='search' component={ SearchResult } />
            <Route path='college/:id' component={ SingleCollege } />
            <Route path='recovery' component={ Recovery } />
            <Route path='notifications' component={Notifications} />
        </Route>
    </Route>
);
