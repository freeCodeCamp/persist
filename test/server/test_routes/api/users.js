const expect = require('expect');
const request = require('supertest');
const path = require('path');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {testRoute} = require('../../testUtils');

const commonDir = path.join(process.env.PWD, 'app/common/');
const { ROLE_ADMIN, ROLE_OWNER, ROLE_COUNSELOR } = require(path.join(commonDir, 'constants'));
const {users} = require('../../dbseed/seed');

import app from '../../../../app/server/server';

describe('/api/users', () => {
  describe('GET', () => {
    it('should return 401 for an unauthorized user', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/users')
          },
          response: {
            'status': 401
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return an empty array for users with roles below ROLE_COUNSELOR', (done) => {
      const user = users.filter(user => user.access.role === 'Student')[0];
      const authHeader = 'JWT ' + jwt.sign(user, process.env.SECRET, {expiresIn: 100080});

      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/users'),
            authHeader,
          },
          response: {
            'status': 200,
            'body': [],
          }
        }
      ];

      testRoute(app, tests, done);
    });

    // FIXME BROKEN: Does not return other users from the counselor's school
    it.skip('should return an array of users from the same school, the Admin, and the Owner when authenticated user has ROLE_COUNSELOR', (done) => {
      const user = users.filter(user => user.email === 'userone@test.com')[0];
      const authHeader = 'JWT ' + jwt.sign(user, process.env.SECRET, {expiresIn: 100080});

      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/users'),
            authHeader,
          },
          response: {
            'status': 200,
            'body.length': users.filter(({access: {role, school}}) => role === ROLE_OWNER ||
                                                                      role === ROLE_ADMIN ||
                                                                      school === user.access.school)
                                .length,
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return an array of all users from the DB when authenticated user has ROLE_OWNER or ROLE_ADMIN', (done) => {
      const user = users.filter(user => user.access.role === ROLE_OWNER)[0];
      const authHeader = 'JWT ' + jwt.sign(user, process.env.SECRET, {expiresIn: 100080});

      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/users'),
            authHeader,
          },
          response: {
            'status': 200,
            'body.length': users.length,
          }
        }
      ];

      testRoute(app, tests, done);
    });
  });
});
