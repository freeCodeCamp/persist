import expect from 'expect';
import sinon from 'sinon';
import moxios from 'moxios';

import * as types from '../../../app/client/src/actions/types';
import { getAllColleges, getAllCounselors, getAllSchools, getAllStudents } from '../../../app/client/src/actions/initialData';

describe('initialData Actions', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    describe('getAllColleges', () => {
        it('should dispatch GET_ALL_COLLEGES_PENDING', () => {
            const dispatch = sinon.spy();
            getAllColleges()(dispatch);
            sinon.assert.calledWith(dispatch, { type: types.GET_ALL_COLLEGES_PENDING });
        });

        it('should dispatch GET_ALL_COLLEGES_SUCCESS with payload: response.data if successful', done => {
            const dispatch = sinon.spy();
            moxios.wait(() => {
                let request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: 'data'
                });
            });
            getAllColleges()(dispatch).then(() => {
                try {
                    sinon.assert.calledWith(dispatch, { type: types.GET_ALL_COLLEGES_SUCCESS, payload: 'data' });
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('should dispatch GET_ALL_COLLEGES_ERROR with payload: err if not successful', done => {
            const dispatch = sinon.spy();
            moxios.wait(() => {
                let request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 400
                });
            });
            getAllColleges()(dispatch).catch(err => {
                try {
                    expect(err).toBeA(Error);
                    sinon.assert.calledWith(dispatch, { type: types.GET_ALL_COLLEGES_ERROR, payload: err });
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });

    describe('getAllCounselors', () => {
        it('should dispatch GET_ALL_USERS_PENDING', () => {
            const dispatch = sinon.spy();
            getAllCounselors()(dispatch);
            sinon.assert.calledWith(dispatch, { type: types.GET_ALL_USERS_PENDING });
        });

        it('should dispatch GET_ALL_USERS_SUCCESS with payload: data if successful', done => {
            const dispatch = sinon.spy();
            moxios.wait(() => {
                let request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: 'data'
                });
            });
            getAllCounselors()(dispatch).then(() => {
                try {
                    sinon.assert.calledWith(dispatch, { type: types.GET_ALL_USERS_SUCCESS, payload: 'data' });
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('should dispatch GET_ALL_USERS_ERROR with payload: err if not successful', done => {
            const dispatch = sinon.spy();
            moxios.wait(() => {
                let request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 400
                });
            });
            getAllCounselors()(dispatch).catch(err => {
                try {
                    expect(err).toBeA(Error);
                    sinon.assert.calledWith(dispatch, { type: types.GET_ALL_USERS_ERROR, payload: err });
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });

    describe('getAllSchools', () => {
        it('should dispatch GET_ALL_SCHOOLS_PENDING', () => {
            const dispatch = sinon.spy();
            getAllSchools()(dispatch);
            sinon.assert.calledWith(dispatch, { type: types.GET_ALL_SCHOOLS_PENDING });
        });

        it('should dispatch GET_ALL_SCHOOLS_SUCCESS with payload: data if successful', done => {
            const dispatch = sinon.spy();
            moxios.wait(() => {
                let request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: 'data'
                });
            });
            getAllSchools()(dispatch).then(() => {
                try {
                    sinon.assert.calledWith(dispatch, { type: types.GET_ALL_SCHOOLS_SUCCESS, payload: 'data' });
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('should dispatch GET_ALL_SCHOOLS_ERROR with payload: err if not successful', done => {
            const dispatch = sinon.spy();
            moxios.wait(() => {
                let request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 400
                });
            });
            getAllSchools()(dispatch).catch(err => {
                try {
                    expect(err).toBeA(Error);
                    sinon.assert.calledWith(dispatch, { type: types.GET_ALL_SCHOOLS_ERROR, payload: err });
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });

    describe('getAllStudents', () => {
        it('should dispatch GET_ALL_STUDENTS_PENDING', () => {
            const dispatch = sinon.spy();
            getAllStudents()(dispatch);
            sinon.assert.calledWith(dispatch, { type: types.GET_ALL_STUDENTS_PENDING });
        });

        it('should dispatch GET_ALL_STUDENTS_SUCCESS with payload: data if successful', done => {
            const dispatch = sinon.spy();
            moxios.wait(() => {
                let request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 200,
                    response: 'data'
                });
            });
            getAllStudents()(dispatch).then(() => {
                try {
                    sinon.assert.calledWith(dispatch, { type: types.GET_ALL_STUDENTS_SUCCESS, payload: 'data' });
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('should dispatch GET_ALL_STUDENTS_ERROR with payload: err if not successful', done => {
            const dispatch = sinon.spy();
            moxios.wait(() => {
                let request = moxios.requests.mostRecent();
                request.respondWith({
                    status: 400
                });
            });
            getAllStudents()(dispatch).catch(err => {
                try {
                    expect(err).toBeA(Error);
                    sinon.assert.calledWith(dispatch, { type: types.GET_ALL_STUDENTS_ERROR, payload: err });
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });
});
