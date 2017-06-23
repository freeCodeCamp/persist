const expect = require('expect');
const request = require('supertest');
const path = require('path');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {testRoute} = require('../../testUtils');

const commonDir = path.join(process.env.PWD, 'app/common/');
const { ROLE_ADMIN, ROLE_OWNER, ROLE_COUNSELOR } = require(path.join(commonDir, 'constants'));
const {students, users} = require('../../dbseed/seed');

import app from '../../../../app/server/server';

describe('/api/students', () => {
  describe('GET', () => {
    it('should return 401 for an unauthorized user', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/students')
          },
          response: {
            'status': 401
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it.only('should return an array of students from the matching school when authenticated user has ROLE_COUNSELOR', (done) => {
      const user = users.filter(user => user.access.role === ROLE_COUNSELOR)[0];
      const token = jwt.sign(user, process.env.SECRET, {expiresIn: 100080});

      console.log('JWT Token: ', token);

      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/students'),
            token,
          },
          response: {
            'status': 200
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return an array of all students from the DB when authenticated user has ROLE_OWNER', () => {});
  });
});
