import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import cookie from 'react-cookie';
import { Router } from 'react-router';
import { LOGIN_SUCCESS } from './actions/types';
import routes from './routes';
// redux store
import store, { history } from './store';
require('../public/style/main2.scss');

const token = cookie.load('token');
const user = cookie.load('user');
if (token) {
    store.dispatch({
        type: LOGIN_SUCCESS,
        payload: user
    });
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>{routes}</Router>
    </Provider>,
    document.querySelector('#root')
);
