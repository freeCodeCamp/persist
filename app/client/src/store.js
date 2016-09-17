import { createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
// middleware
import logger from 'redux-logger';
const middleware = applyMiddleware(logger());

// import the root reducer
import rootReducer from './reducers/index';

// creating store
const store = createStore(rootReducer, middleware);

// syncing history with redux
export const history = syncHistoryWithStore(browserHistory, store);

export default store;