import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { Router, Route, browserHistory, IndexRoute } from 'react-router';

//components
import App from './components/app';
import CommentBox from './components/comment_box';
import DashboardMain from './components/adminlte/pages/DashboardMain';
import Upload from './components/adminlte/pages/Upload';
import Schools from './components/adminlte/pages/Schools';
import Students from './components/adminlte/pages/Students';


//redux store
import store, { history } from './store';


ReactDOM.render(
  <Provider store={store}>
  	<Router history={history}>
    	<Route path='/' component={App}>
    		<IndexRoute component={DashboardMain} />
    		<Route path='upload' component={Upload} />
    		<Route path='schools' component={Schools} />
    		<Route path='students' component={Students} />
    	</Route>
    </Router>
  </Provider>
  , document.querySelector('#root'));
