const expect = require('expect');
const request = require('supertest');
const sinon = require('sinon');
const path = require('path');
const _ = require('lodash');
const { testRoute } = require('../../testUtils');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));
const commonDir = path.join(process.env.PWD, 'app/common/');
const { ROLE_ADMIN, ROLE_OWNER, ROLE_COUNSELOR } = require(path.join(commonDir, 'constants'));
const { students, users } = require('../../dbseed/seed');

import app from '../../../../app/server/server';

describe('/api/students', () => {
    var sandbox;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });
    afterEach(() => {
        sandbox.restore();
    });
    describe('GET', () => {
        it('should return 401 for an unauthorized user', done => {
            const tests = [
                {
                    request: {
                        method: 'get',
                        url: encodeURI('/api/students')
                    },
                    response: {
                        status: 401
                    }
                }
            ];

            testRoute(app, tests, done);
        });

        it('should return an empty array of students when authenticated user has a role below ROLE_COUNSELOR', done => {
            const user = users.filter(user => user.access.role === 'Student')[0];

            const tests = [
                {
                    request: {
                        method: 'get',
                        url: encodeURI('/api/students'),
                        authUser: user
                    },
                    response: {
                        status: 200,
                        body: [],
                        'body.length': 0
                    }
                }
            ];

            testRoute(app, tests, done);
        });

        it('should return an array of students from the matching school when authenticated user has ROLE_COUNSELOR', done => {
            const user = users.filter(user => user.access.role === ROLE_COUNSELOR)[0];

            const tests = [
                {
                    request: {
                        method: 'get',
                        url: encodeURI('/api/students'),
                        authUser: user
                    },
                    response: {
                        status: 200,
                        'body.0.hs': students[0].hs.toString(),
                        'body.1.hs': students[1].hs.toString(),
                        'body.length': 2
                    }
                }
            ];

            testRoute(app, tests, done);
        });

        it('should return an array of all students from the DB when authenticated user has ROLE_OWNER', done => {
            const authUser = users.filter(user => user.access.role === ROLE_OWNER)[0];

            const tests = [
                {
                    request: {
                        method: 'get',
                        url: encodeURI('/api/students'),
                        authUser
                    },
                    response: {
                        status: 200,
                        'body.length': 3
                    }
                }
            ];

            testRoute(app, tests, done);
        });

        it('should return status 500 if querying the DB causes an error', done => {
            const user = users.filter(user => user.access.role === ROLE_COUNSELOR)[0];

            const tests = [
                {
                    request: {
                        method: 'get',
                        url: encodeURI('/api/students'),
                        authUser: user
                    },
                    response: {
                        status: 500
                    }
                }
            ];

            const mockQuery = {
                lean: () => this,
                exec: () => Promise.reject(new Error('Mock Error'))
            };

            sandbox
                .mock(dbModels.Student)
                .expects('find')
                .returns(mockQuery);

            testRoute(app, tests, done);
        });
    });
});
