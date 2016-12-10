import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {Router} from 'react-router';
import routes from './routes';
// redux store
import store, {history} from './store';

require('../public/style/main2.scss')

ReactDOM.render(
    <Provider store={ store }>
        <Router history={ history }>
            {routes}
        </Router>
    </Provider>
    , document.querySelector('#root'));
