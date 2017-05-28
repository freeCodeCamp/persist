import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { expect } from '../test_helper';
import { getCollege } from '../../app/client/src/actions/getCollege';
import { GET_COLLEGE_SUCCESS, GET_COLLEGE_ERROR, GET_COLLEGE_PENDING } from '../../app/client/src/actions/types';

/* Mock the store */
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Filter Colleges Action', () => {

		  beforeEach(() => {
		    moxios.install();
		  });

		  afterEach(() => {
		    moxios.uninstall();
		  });

		  it('should create action GET_COLLEGE_SUCCESS after successfully getting colleges', () => {

		  		// create mock
			    moxios.wait(() => {
			      const request = moxios.requests.mostRecent();
			      request.respondWith({
			        status: 200,
			        response: [{fullName: 'Test College 1'}]
			      });
			    });

			    // expected actions
			    const expectedActions = [
			      { type: GET_COLLEGE_PENDING },
			      { type: GET_COLLEGE_SUCCESS, payload: {fullName: 'Test College 1'} }
			    ];

			    // mock the store
		    	const store = mockStore({ college: null });

		    	// dispatch the action and check result
			    return store.dispatch(getCollege('test'))
			    .then(() => {
			      expect(store.getActions()).to.deep.equal(expectedActions);
			    });
		  });

		  it('should create action GET_COLLEGE_ERROR after failing to get college', () => {

		  		// create mock
			    moxios.wait(() => {
			      const request = moxios.requests.mostRecent();
			      request.respondWith({
			        status: 400
			      });
			    });

			    // expected actions
			    const expectedActions = [
			      { type: GET_COLLEGE_PENDING },
			      { type: GET_COLLEGE_ERROR, payload: "Error: Request failed with status code 400"}
			    ];

			    // mock the store
		    	const store = mockStore({ college: null });

		    	// dispatch the action and check result
			    return store.dispatch(getCollege('negtest'))
			    .then(() => {
			    	store.getActions()[1].payload = store.getActions()[1].payload.toString();
			      	expect(store.getActions()).to.deep.equal(expectedActions);
			    });
		  });

});