const _ = require('lodash');
const expect = require('expect');
const jwt = require('jsonwebtoken');
const path = require('path');
const request = require('supertest');
const sinon = require('sinon');
const { testRoute } = require('../../testUtils');

const commonDir = path.join(process.env.PWD, 'app/common/');
const dbModels = require(path.join(process.env.PWD, 'app/server/models'));
const { ROLE_ADMIN, ROLE_OWNER, ROLE_COUNSELOR } = require(path.join(commonDir, 'constants'));
const { users } = require('../../dbseed/seed');

import app from '../../../../app/server/server';

describe('/api/users', () => {
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
                        url: encodeURI('/api/users')
                    },
                    response: {
                        status: 401
                    }
                }
            ];

            testRoute(app, tests, done);
        });

        it('should return an empty array for users with roles below ROLE_COUNSELOR', done => {
            const user = users.filter(user => user.access.role === 'Student')[0];

            const tests = [
                {
                    request: {
                        method: 'get',
                        url: encodeURI('/api/users'),
                        authUser: user
                    },
                    response: {
                        status: 200,
                        body: []
                    }
                }
            ];

            testRoute(app, tests, done);
        });

        it('should return an array of users from the same school, the Admin, and the Owner when authenticated user has ROLE_COUNSELOR', done => {
            const user = users[1];

            const tests = [
                {
                    request: {
                        method: 'get',
                        url: encodeURI('/api/users'),
                        authUser: user
                    },
                    response: {
                        status: 200,
                        'body.length': users.filter(
                            ({ access: { role, school } }) => role === ROLE_OWNER || role === ROLE_ADMIN || school === user.access.school
                        ).length
                    }
                }
            ];

            testRoute(app, tests, done);
        });

        it('should return an array of all users from the DB when authenticated user has ROLE_OWNER or ROLE_ADMIN', done => {
            const user = users.filter(user => user.access.role === ROLE_OWNER)[0];

            const tests = [
                {
                    request: {
                        method: 'get',
                        url: encodeURI('/api/users'),
                        authUser: user
                    },
                    response: {
                        status: 200,
                        'body.length': users.length
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
                        url: encodeURI('/api/users'),
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
                .mock(dbModels.User)
                .expects('find')
                .returns(mockQuery);

            testRoute(app, tests, done);
        });
    });
});
