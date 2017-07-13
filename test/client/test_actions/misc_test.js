import expect from 'expect';
import sinon from 'sinon';
import moxios from 'moxios';

import * as types from '../../../app/client/src/actions/types';
// import updateUserName from '../../../app/client/src/actions/updateUserName';

// describe.only('Misc Actions', () => {
//   beforeEach(() => {
//     moxios.install();
//   });

//   afterEach(() => {
//     moxios.uninstall();
//   });

//   describe('updateUserName', () => {
//     it('should dispatch SPINNER_PAGE and CLOSE_NAME_EDIT', (done) => {
//       const dispatch = sinon.spy();
//       moxios.wait(() => {
//         let request = moxios.requests.mostRecent();
//         request.respondWith({status: 200});
//       });
//       updateUserName('first', 'last')(dispatch).then(() => {
//         try {
//           sinon.assert.calledWith(dispatch, {
//             type: types.SPINNER_PAGE,
//             payload: true
//           });
//           sinon.assert.calledWith(dispatch, {
//             type: types.CLOSE_NAME_EDIT
//           });
//           done();
//         } catch (err) {
//           done(err);
//         }
//       })
//     });

//     it('should dispatch UPDATE_USER_NAME_SUCCESS, SPINNER_PAGE, and CLOSE_NAME_EDIT if successful', () => {});

//     it('should dispatch UPDATE_USER_NAME_ERROR, SPINNER_PAGE if failed', (done) => {
//       const dispatch = sinon.spy();
//       moxios.wait(() => {
//         let request = moxios.requests.mostRecent();
//         request.respondWith({status: 400});
//       });
//       updateUserName('first', 'last')(dispatch).catch(err => {
//         try {
//           expect(err).toBeA(Error);
//           sinon.assert.calledWith(dispatch, {
//             type: types.UPDATE_USER_NAME_ERROR,
//             payload: err
//           });
//           sinon.assert.calledWith(dispatch, {
//             type: types.SPINNER_PAGE,
//             payload: false
//           });
//           done();
//         } catch (err) {
//           done(err);
//         }
//       });
//     });
//   });
// })