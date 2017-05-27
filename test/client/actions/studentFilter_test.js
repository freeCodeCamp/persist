import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { expect } from '../test_helper';
import { filterStudents } from '../../app/client/src/actions/studentFilter';
import { FILTER_STUDENT_SUCCESS, FILTER_STUDENT_ERROR, FILTER_STUDENT_PENDING } from '../../app/client/src/actions/types';

/* Mock the store */
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Filter Students Action', () => {

		  beforeEach(() => {
		    moxios.install();
		  });

		  afterEach(() => {
		    moxios.uninstall();
		  });

		  it('should create action FILTER_STUDENT_SUCCESS after successfully getting students', () => {

		  		// create mock
			    moxios.wait(() => {
			      const request = moxios.requests.mostRecent();
			      request.respondWith({
			        status: 200,
			        response: [{fullName: 'Test Student 1'}, {fullName: 'Test Student 2'}]
			      });
			    });

			    // expected actions
			    const expectedActions = [
			      { type: FILTER_STUDENT_PENDING },
			      { type: FILTER_STUDENT_SUCCESS, payload: [{fullName: 'Test Student 1'}, {fullName: 'Test Student 2'}] }
			    ];

			    // mock the store
		    	const store = mockStore({ studentFilter: null });

		    	// dispatch the action and check result
			    return store.dispatch(filterStudents({}))
			    .then(() => {
			      expect(store.getActions()).to.deep.equal(expectedActions);
			    });
		  });

		  it('should create action FILTER_STUDENT_ERROR after failing to get student', () => {

		  		// create mock
			    moxios.wait(() => {
			      const request = moxios.requests.mostRecent();
			      request.respondWith({
			        status: 400
			      });
			    });

			    // expected actions
			    const expectedActions = [
			      { type: FILTER_STUDENT_PENDING },
			      { type: FILTER_STUDENT_ERROR, payload: "Error: Request failed with status code 400"}
			    ];

			    // mock the store
		    	const store = mockStore({ studentFilter: null });

		    	// dispatch the action and check result
			    return store.dispatch(filterStudents('negtest'))
			    .then(() => {
			    	store.getActions()[1].payload = store.getActions()[1].payload.toString();
			      	expect(store.getActions()).to.deep.equal(expectedActions);
			    });
		  });

});