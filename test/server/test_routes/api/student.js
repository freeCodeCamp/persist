const _ = require('lodash');
const expect = require('expect');
const path = require('path');
const request = require('supertest');
const sinon = require('sinon');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));

const {testRoute} = require('../../testUtils');
const {students} = require('../../dbseed/seed');

import app from '../../../../app/server/server';

describe('/api/student/:osis', () => {
  var sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('GET', () => {
    it('should return a JSON description of an existing student from the DB', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: '/api/student/200205492'
          },
          response: {
            'status': 200,
            'body.osis': 200205492,
            'body.hsGradYear': 2014,
            'body.firstName': 'Jon',
            'body.lastName': 'Jonson'
          }
        }, {
          request: {
            method: 'get',
            url: '/api/student/209287145'
          },
          response: {
            'status': 200,
            'body.osis': 209287145,
            'body.hsGradYear': 2015,
            'body.firstName': 'Anon',
            'body.lastName': 'Ymous'
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return status 404 for a student that does not exist in the DB', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: '/api/student/2002092'
          },
          response: {
            'status': 404
          }
        }, {
          request: {
            method: 'get',
            url: '/api/student/2092145'
          },
          response: {
            'status': 404
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return status 500 on server error', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: '/api/student/200205492'
          },
          response: {
            'status': 500
          }
        }
      ];

      sandbox.mock(dbModels.Student)
        .expects('findOne')
        .rejects(new Error());

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
              taxDocumentsSubmitted: true
            }
          },
          response: {
            'status': 200,
            'body.osis': 200205492,
            'body.firstName': 'Joe',
            'body.fullName': 'Joe Jonson',
            'body.taxDocumentsSubmitted': true
          }
        }, {
          request: {
            method: 'put',
            url: '/api/student/209287145',
            body: {
              photoReleaseForm: true,
              needsFollowup: true,
              taxDocumentsSubmitted: true
            }
          },
          response: {
            'status': 200,
            'body.osis': 209287145,
            'body.firstName': 'Anon',
            'body.fullName': 'Anon Ymous',
            'body.photoReleaseForm': true,
            'body.needsFollowup': true,
            'body.taxDocumentsSubmitted': true
          }
        }
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
              taxDocumentsSubmitted: true
            }
          },
          response: {
            'status': 404
          }
        }, {
          request: {
            method: 'put',
            url: '/api/student/20928715',
            body: {
              photoReleaseForm: true,
              needsFollowup: true,
              taxDocumentsSubmitted: true
            }
          },
          response: {
            'status': 404
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return status 500 if the Mongoose querey throws an error', (done) => {
      const tests = [
        {
          request: {
            method: 'put',
            url: '/api/student/200205492',
            body: {
              firstName: 'Joe',
              fullName: 'Joe Jonson',
              taxDocumentsSubmitted: true
            }
          },
          response: {
            'status': 500,
          }
        }, {
          request: {
            method: 'put',
            url: '/api/student/209287145',
            body: {
              photoReleaseForm: true,
              needsFollowup: true,
              taxDocumentsSubmitted: true
            }
          },
          response: {
            'status': 500,
          }
        }
      ];
      sandbox.mock(dbModels.Student)
        .expects('findOne')
        .rejects(new Error());

      testRoute(app, tests, done);
    });

    it.skip('should return status 500 if saving the new version throws an error *UNSURE HOW TO MOCK save METHOD ON MONGOOSE INSTANCE*', (done) => {
      const tests = [
        {
          request: {
            method: 'put',
            url: '/api/student/200205492',
            body: {
              firstName: 'Joe',
              fullName: 'Joe Jonson',
              taxDocumentsSubmitted: true
            }
          },
          response: {
            'status': 500,
          }
        }, {
          request: {
            method: 'put',
            url: '/api/student/209287145',
            body: {
              photoReleaseForm: true,
              needsFollowup: true,
              taxDocumentsSubmitted: true
            }
          },
          response: {
            'status': 500,
          }
        }
      ];
      sandbox.mock(dbModels.Student)
        .expects('save')
        .rejects(new Error());

      testRoute(app, tests, done);
    });
  });

  describe('DELETE', () => {
    // Route is currently unimplemented
  });
});
