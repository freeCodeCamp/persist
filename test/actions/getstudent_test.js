import moxios from 'moxios';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { expect } from '../test_helper';
import { getStudent } from '../../app/client/src/actions/getStudent';
import { GET_STUDENT_SUCCESS, GET_STUDENT_ERROR, GET_STUDENT_PENDING, GET_STUDENT_RESET } from '../../app/client/src/actions/types';

/* Mock the store */
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Get Student Action', () => {

		  beforeEach(() => {
		    moxios.install();
		  });

		  afterEach(() => {
		    moxios.uninstall();
		  });

		  it('should create action GET_STUDENT_SUCCESS after successfully getting student', () => {

		  		// create mock
			    moxios.wait(() => {
			      const request = moxios.requests.mostRecent();
			      request.respondWith({
			        status: 200,
			        response: [{fullName: 'Chris'}],
			      });
			    });

			    // expected actions
			    const expectedActions = [
			      { type: GET_STUDENT_PENDING },
			      { type: GET_STUDENT_SUCCESS, payload: {fullName: 'Chris'} }
			    ];

			    // mock the store
		    	const store = mockStore({ singleStudent: null });

		    	// dispatch the action and check result
			    return store.dispatch(getStudent('test'))
			    .then(() => {
			      expect(store.getActions()).to.deep.equal(expectedActions);
			    });
		  });

		  it('should create action GET_STUDENT_ERROR after failing to get student', () => {

		  		// create mock
			    moxios.wait(() => {
			      const request = moxios.requests.mostRecent();
			      request.respondWith({
			        status: 400
			      });
			    });

			    // expected actions
			    const expectedActions = [
			      { type: GET_STUDENT_PENDING },
			      { type: GET_STUDENT_ERROR, payload: "Error: Request failed with status code 400"}
			    ];

			    // mock the store
		    	const store = mockStore({ singleStudent: null });

		    	// dispatch the action and check result
			    return store.dispatch(getStudent('negtest'))
			    .then(() => {
			    	store.getActions()[1].payload = store.getActions()[1].payload.toString();
			      	expect(store.getActions()).to.deep.equal(expectedActions);
			    });
		  });


});