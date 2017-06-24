const expect = require('expect');
const request = require('supertest');
const path = require('path');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const {testRoute} = require('../../testUtils');

const commonDir = path.join(process.env.PWD, 'app/common/');
const { ROLE_ADMIN, ROLE_OWNER, ROLE_COUNSELOR } = require(path.join(commonDir, 'constants'));
const {colleges, users} = require('../../dbseed/seed');

import app from '../../../../app/server/server';

describe('/api/colleges', () => {
  describe('GET', () => {
    it('should return 401 for an unauthorized user', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/colleges')
          },
          response: {
            'status': 401
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return an array of all colleges from the databse when user is authenticated', (done) => {
      const user = users[1];
      const authHeader = 'JWT ' + jwt.sign(user, process.env.SECRET, {expiresIn: 100080});

      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/colleges'),
            authHeader,
          },
          response: {
            'status': 200,
            'body.0._id': colleges[0]._id.toString(),
            'body.length': 2,
          }
        }
      ];

      testRoute(app, tests, done);
    });
  });
});
