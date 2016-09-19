import { createStore, applyMiddleware } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
// middleware
import logger from 'redux-logger';
import reduxThunk from 'redux-thunk';
const middleware = applyMiddleware(logger(), reduxThunk);

// import the root reducer
import rootReducer from './reducers/index';

// creating store
const store = createStore(rootReducer, middleware);

// syncing history with redux
export const history = syncHistoryWithStore(browserHistory, store);

export default store;