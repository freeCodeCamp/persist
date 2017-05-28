import expect from 'expect';
import sinon from 'sinon';
import moxios from 'moxios';

import * as types from '../../../app/client/src/actions/types';
import {loginUser, registerUser, getForgotPasswordToken, updatePassword} from '../../../app/client/src/actions/authentication';

describe('Authentication Actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  })
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
        sinon.assert.calledWith(dispatch, {type: types.FORGOT_PASSWORD_PENDING});
        sinon.assert.calledWith(dispatch, {type: types.FORGOT_PASSWORD_SUCCESS});
        done();
      });

    });
  });
});
