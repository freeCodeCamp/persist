import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { Router, Route, IndexRoute } from 'react-router';

// components
import App from './components/app';
import DashboardMain from './components/pages/DashboardMain';
import Upload from './components/pages/Upload';
import Schools from './components/pages/Schools';
import Students from './components/pages/Students';
import SingleStudent from './components/pages/SingleStudent';
import SingleCollege from './components/pages/SingleCollege';
import Colleges from './components/pages/Colleges';

// redux store
import store, { history } from './store';

require('../public/style/main2.scss')

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history }>
      <Route path='/' component={ App }>
        <IndexRoute component={ DashboardMain } />
        <Route path='upload' component={ Upload } />
        <Route path='schools' component={ Schools } />
        <Route path='students' component={ Students } />
        <Route path='colleges' component={ Colleges } />
        <Route path='student/:osis' component={ SingleStudent } />
        <Route path='college/:fullName' component={ SingleCollege } />
      </Route>
    </Router>
  </Provider>
  , document.querySelector('#root'));
