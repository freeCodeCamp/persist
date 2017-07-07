const _ = require('lodash');
const expect = require('expect');
const path = require('path');
const request = require('supertest');
const sinon = require('sinon');
const { testRoute } = require('../../testUtils');

const commonDir = path.join(process.env.PWD, 'app/common/');
const dbModels = require(path.join(process.env.PWD, 'app/server/models'));
const { ROLE_ADMIN, ROLE_OWNER, ROLE_COUNSELOR } = require(path.join(commonDir, 'constants'));
const { colleges, users } = require('../../dbseed/seed');

import app from '../../../../app/server/server';

describe('/api/colleges', () => {
  var sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('GET', () => {
    it('should return 401 for an unauthorized user', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/colleges')
          },
          response: {
            status: 401
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return an array of all colleges from the databse when user is authenticated', (done) => {
      const authUser = users[1];

      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/colleges'),
            authUser
          },
          response: {
            status: 200,
            'body.length': colleges.length
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return status 500 if querying the DB causes an error', (done) => {
      const user = users.filter(user => user.access.role === ROLE_COUNSELOR)[0];

      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/colleges'),
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

      sandbox.mock(dbModels.College)
        .expects('find')
        .returns(mockQuery);

      testRoute(app, tests, done);
    });
  });
});