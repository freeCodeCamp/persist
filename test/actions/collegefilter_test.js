import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { expect } from '../test_helper';
import { filterColleges } from '../../app/client/src/actions/collegeFilter';
import { FILTER_COLLEGE_SUCCESS, FILTER_COLLEGE_ERROR, FILTER_COLLEGE_PENDING } from '../../app/client/src/actions/types';

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

		  it('should create action FILTER_COLLEGE_SUCCESS after successfully getting colleges', () => {

		  		// create mock
			    moxios.wait(() => {
			      const request = moxios.requests.mostRecent();
			      request.respondWith({
			        status: 200,
			        response: [{fullName: 'Test College 1'}, {fullName: 'Test College 2'}]
			      });
			    });

			    // expected actions
			    const expectedActions = [
			      { type: FILTER_COLLEGE_PENDING },
			      { type: FILTER_COLLEGE_SUCCESS, payload: [{fullName: 'Test College 1'}, {fullName: 'Test College 2'}] }
			    ];

			    // mock the store
		    	const store = mockStore({ collegeFilter: null });

		    	// dispatch the action and check result
			    return store.dispatch(filterColleges({}))
			    .then(() => {
			      expect(store.getActions()).to.deep.equal(expectedActions);
			    });
		  });

});