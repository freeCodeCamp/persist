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
const { schools, users } = require('../../dbseed/seed');

import app from '../../../../app/server/server';

describe('/api/schools', () => {
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
            url: encodeURI('/api/schools')
          },
          response: {
            status: 401
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return an array of all schools from the databse when user is authenticated', (done) => {
      const user = users[1];

      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/schools'),
            authUser: user
          },
          response: {
            status: 200,
            'body.length': 3
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return status 500 if querying the DB causes an error', (done) => {
      const user = users[1];

      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/schools'),
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

      sandbox.mock(dbModels.School)
        .expects('find')
        .returns(mockQuery);

      testRoute(app, tests, done);
    });
  });
});