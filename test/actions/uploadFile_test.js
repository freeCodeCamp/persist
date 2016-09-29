// import moxios from 'moxios';
// import thunk from 'redux-thunk';
// import configureMockStore from 'redux-mock-store';

// import { expect } from '../test_helper';
// import { uploadFile } from '../../app/client/src/actions/uploadFile';
// import { SPINNER, UPLOAD_FILE_SUCCESS, UPLOAD_FILE_ERROR, UPLOAD_FILE_PENDING } from '../../app/client/src/actions/types';

// /* Mock the store */
// const middlewares = [ thunk ];
// const mockStore = configureMockStore(middlewares);

// describe('Upload File Action', () => {

// 		  beforeEach(() => {
// 		    moxios.install();
// 		  });

// 		  afterEach(() => {
// 		    moxios.uninstall();
// 		  });

		  
		  
		  

// 		  it('should show SUCCESS correctly: fire SHOW_SPINNER while pending, remove spinner, then fire UPLOAD_FILE_SUCESS', () => {

// 		  		// create mock
// 			    moxios.wait(() => {
// 			      const request = moxios.requests.mostRecent();
// 			      request.respondWith({
// 			        status: 200,
// 			        response: [{fullName: 'Test Student 1'}, {fullName: 'Test Student 2'}]
// 			      });
// 			    });

// 			    // expected actions
// 			    const expectedActions = [
// 			      { type: SPINNER, payload: true },
// 			      { type: SPINNER, payload: false },
// 			      { type: UPLOAD_FILE_SUCCESS, payload: 'test message' }
// 			    ];

// 			    // mock the store
// 		    	const store = mockStore({ message: null });

// 		    	// dispatch the action and check result
// 			    return store.dispatch(uploadFile('/api/test', {}))
// 			    .then(() => {
// 			      expect(store.getActions()).to.deep.equal(expectedActions);
// 			    });
// 		  });

// 		  it('should show ERROR correctly: fire SHOW_SPINNER while pending, remove spinner, then fire UPLOAD_FILE_ERROR', () => {

// 		  		// create mock
// 			    moxios.wait(() => {
// 			      const request = moxios.requests.mostRecent();
// 			      request.respondWith({
// 			        status: 400
// 			      });
// 			    });

// 			    // expected actions
// 			    const expectedActions = [
// 			      { type: SPINNER, payload: true },
// 			      { type: SPINNER, payload: false },
// 			      { type: UPLOAD_FILE_ERROR, payload: "Error: Request failed with status code 400"}
// 			    ];

// 			    // mock the store
// 		    	const store = mockStore({ message: null });

// 		    	// dispatch the action and check result
// 			    return store.dispatch(uploadFile('/api/test', {}))
// 			    .then(() => {
// 			    	store.getActions()[1].payload = store.getActions()[1].payload.toString();
// 			      	expect(store.getActions()).to.deep.equal(expectedActions);
// 			    });
// 		  });

// });