import expect from 'expect';
import sinon from 'sinon';
import moxios from 'moxios';

import * as types from '../../../app/client/src/actions/types';
import {registerUser, getForgotPasswordToken, updatePassword} from '../../../app/client/src/actions/authentication';

describe('Authentication Actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('forgotPassword', () => {
    it('should call dispatch FORGOT_PASSWORD_PENDING', (done) => {
      const dispatch = sinon.spy();
      const thunk = getForgotPasswordToken({email: 'userone@test.com'});
      expect(thunk).toBeA('function');

      moxios.wait(() => {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: []
        });
      });

      thunk(dispatch).then(() => {
        try {
          sinon.assert.calledWith(dispatch, {type: types.FORGOT_PASSWORD_PENDING});
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('should dispatch FORGOT_PASSWORD_SUCCESS if axios.post succeeds', (done) => {
      const dispatch = sinon.spy();
      const thunk = getForgotPasswordToken({email: 'userone@test.com'});
      expect(thunk).toBeA('function');

      moxios.wait(() => {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: []
        });
      });

      thunk(dispatch).then(() => {
        try {
          sinon.assert.calledWith(dispatch, {type: types.FORGOT_PASSWORD_SUCCESS});
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    // FIXME Decide what SHOULD be dispatched if request fails.  Test currently fails
    // because getForgotPasswordToken doesn't handle errors
    it.skip('should ...? if axios.post fails', (done) => {
      const dispatch = sinon.spy();
      const thunk = getForgotPasswordToken({email: 'userone@test.com'});
      expect(thunk).toBeA('function');

      moxios.wait(() => {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 404,
          response: []
        });
      });

      thunk(dispatch).then(() => {
        try {
          sinon.assert.neverCalledWith(dispatch, {type: types.FORGOT_PASSWORD_SUCCESS});
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe('updatePassword', () => {
    it('should dispatch UPDATE_PASSWORD_PENDING', (done) => {
      const dispatch = sinon.spy();
      const token = 'token_123';
      const password = 'test_password';
      const thunk = updatePassword(token, {password});
      expect(thunk).toBeA('function');

      moxios.wait(() => {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: []
        });
      });

      thunk(dispatch).then(() => {
        try {
          sinon.assert.calledWith(dispatch, {type: types.UPDATE_PASSWORD_PENDING});
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('should dispatch UPDATE_PASSWORD_SUCCESS if axios.post succeeds', (done) => {
      const dispatch = sinon.spy();
      const token = 'token_123';
      const password = 'test_password';
      const thunk = updatePassword(token, {password});
      expect(thunk).toBeA('function');

      moxios.wait(() => {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: []
        });
      });

      thunk(dispatch).then(() => {
        try {
          sinon.assert.calledWith(dispatch, {type: types.UPDATE_PASSWORD_SUCCESS});
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    // FIXME Need to decide what SHOULD be dispatched if request fails.  Test currently
    // fails because updatePassword doesn't handle errors.
    it.skip('should ...? if axios.post fails', (done) => {
      const dispatch = sinon.spy();
      const token = 'token_123';
      const password = 'test_password';
      const thunk = updatePassword(token, {password});
      expect(thunk).toBeA('function');

      moxios.wait(() => {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 404,
          response: []
        });
      });

      thunk(dispatch).then(() => {
        try {
          sinon.assert.neverCalledWith(dispatch, {type: types.UPDATE_PASSWORD_SUCCESS});
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe('register', () => {
    it('should dispatch LOGIN_PENDING', (done) => {
      const dispatch = sinon.spy();
      const email = 'test@test.com';
      const password = 'test_password';

      const thunk = registerUser({email, password});
      expect(thunk).toBeA('function');

      moxios.wait(() => {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: {}
        });
      });

      thunk(dispatch).then(() => {
        try {
          sinon.assert.calledWith(dispatch, {type: types.LOGIN_PENDING});
          done()
        } catch (err) {
          done(err);
        }
      });
    });

    it('should dispatch LOGIN_SUCCESS with payload: user if axios.post succeeds', (done) => {
      const dispatch = sinon.spy();
      const email = 'test@test.com';
      const password = 'test_password';
      const user = 'user';

      const thunk = registerUser({email, password});
      expect(thunk).toBeA('function');

      moxios.wait(() => {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 200,
          response: {
            token: 'token_123',
            user,
          }
        });
      });

      thunk(dispatch).then(() => {
        try {
          sinon.assert.calledThrice(dispatch);
          sinon.assert.calledWith(dispatch, {type: types.LOGIN_SUCCESS, payload: user});
          done()
        } catch (err) {
          done(err);
        }
      });
    });

    // FIXME Test doesn't work right.  Should test that dispatch is called with
    // {type: types.LOGIN_ERROR, payload: new Error('Request failed with status code 404')}
    // however that won't match. Likely due to differences between the error object here
    // and the one actually generated by axios.
    it.skip('should dispatch LOGIN_ERROR with payload: err if axios.post fails', (done) => {
      const dispatch = sinon.spy();
      const email = 'test@test.com';
      const password = 'test_password';
      const user = 'user';

      const thunk = registerUser({email, password});
      expect(thunk).toBeA('function');

      moxios.wait(() => {
        let request = moxios.requests.mostRecent()
        request.respondWith({
          status: 404,
          response: {}
        });
      });

      thunk(dispatch).then(() => {
        try {
          sinon.assert.calledTwice(dispatch);
          sinon.assert.neverCalledWith(dispatch,{type: types.LOGIN_SUCCESS, payload: user});
          done()
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
