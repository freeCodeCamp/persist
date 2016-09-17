import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { Router, Route, browserHistory, IndexRoute } from 'react-router';

//components
import App from './components/app';
import CommentBox from './components/comment_box';
import Page1 from './components/adminlte/pages/Page1';
import Upload from './components/adminlte/pages/Upload';

//redux store
import store, { history } from './store';


ReactDOM.render(
  <Provider store={store}>
  	<Router history={history}>
    	<Route path='/' component={App}>
    		<Route path='page1' component={Page1} />
    		<Route path='upload' component={Upload} />
    	</Route>
    </Router>
  </Provider>
  , document.querySelector('#root'));
