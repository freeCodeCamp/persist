import { expect } from '../test_helper';
import { SPINNER } from '../../app/client/src/actions/types';
import { setSpinner } from '../../app/client/src/actions/setSpinner';


/* Mock the store */
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('Set Spinner Action', (done) => {

	describe('setSpinner', () => {

		it('should dispatch the correct action', () => {
		  const initialState = {spinner: false}
		  const setSpinner = { type: SPINNER, payload: true };

		  const store = mockStore(initialState);
		  store.dispatch(setSpinner);

		  const actions = store.getActions();
		  
		  expect(actions).to.deep.equal([setSpinner]);
		});

	});

});