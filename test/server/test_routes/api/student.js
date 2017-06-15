const expect = require('expect');
const request = require('supertest');
const path = require('path');
const _ = require('lodash');
const {testRoute} = require('../../testUtils');

const { students } = require('../../dbseed/seed');

import app from '../../../../app/server/server';

Object.resolve = function(path, obj) {
  return path.split('.').reduce(function(prev, curr) {
    return prev ? prev[curr] : undefined
  }, obj || self);
}

describe('/api/student/:osis', () => {
  describe('GET', () => {
    it('should return a JSON description of an existing student from the DB', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: '/api/student/200205492',
          },
          response: {
            'status': 200,
            'body.osis': 200205492,
            'body.hsGradYear': 2014,
            'body.firstName': 'Jon',
            'body.lastName': 'Jonson',
          },
        },
        {
          request: {
            method: 'get',
            url: '/api/student/209287145',
          },
          response: {
            'status': 200,
            'body.osis': 209287145,
            'body.hsGradYear': 2015,
            'body.firstName': 'Anon',
            'body.lastName': 'Ymous',
          },
        },
      ];

      testRoute(app, tests, done);
    });

    it('should return status 404 for a student that does not exist in the DB', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: '/api/student/2002092',
          },
          response: {
            'status': 404,
          },
        },
        {
          request: {
            method: 'get',
            url: '/api/student/2092145',
          },
          response: {
            'status': 404,
          },
        },
      ];

      testRoute(app, tests, done);
    });

    it.skip('should return status 500 on server error *UNSURE HOW TO FORCE SERVER ERROR WITH GET REQUEST*', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: '/api/student/200205492',
          },
          response: {
            'status': 500,
          },
        },
      ];

      testRoute(app, tests, done);
    });
  });

  describe('POST', () => {
    // Route currently unimplemented
  });

  describe('PUT', () => {
    it('should update an existing student with new values', (done) => {
      const tests = [
        {
          request: {
            method: 'put',
            url: '/api/student/200205492',
            body: {
              firstName: 'Joe',
              fullName: 'Joe Jonson',
              taxDocumentsSubmitted: true,
            }
          },
          response: {
            'status': 200,
            'body.osis': 200205492,
            'body.firstName': 'Joe',
            'body.fullName': 'Joe Jonson',
            'body.taxDocumentsSubmitted': true,
          },
        },
        {
          request: {
            method: 'put',
            url: '/api/student/209287145',
            body: {
              photoReleaseForm: true,
              needsFollowup: true,
              taxDocumentsSubmitted: true,
            }
          },
          response: {
            'status': 200,
            'body.osis': 209287145,
            'body.firstName': 'Anon',
            'body.fullName': 'Anon Ymous',
            'body.photoReleaseForm': true,
            'body.needsFollowup': true,
            'body.taxDocumentsSubmitted': true,
          },
        },
      ];

      testRoute(app, tests, done);
    });

    it('should return status 404 for a student that does not exist in the DB', (done) => {
      const tests = [
        {
          request: {
            method: 'put',
            url: '/api/student/20020542',
            body: {
              firstName: 'Joe',
              fullName: 'Joe Jonson',
              taxDocumentsSubmitted: true,
            }
          },
          response: {
            'status': 404,
          },
        },
        {
          request: {
            method: 'put',
            url: '/api/student/20928715',
            body: {
              photoReleaseForm: true,
              needsFollowup: true,
              taxDocumentsSubmitted: true,
            }
          },
          response: {
            'status': 404,
          },
        },
      ];

      testRoute(app, tests, done);
    });

    it.skip('should return status 500 on server error *UNSURE HOW TO FORCE SERVER ERROR WITH GET REQUEST*', (done) => {});
  });

  describe('DELETE', () => {
    // Route is currently unimplemented
  });
});
