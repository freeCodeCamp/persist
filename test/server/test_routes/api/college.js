const _ = require('lodash');
const expect = require('expect');
const path = require('path');
const request = require('supertest');
const sinon = require('sinon');
const { testRoute } = require('../../testUtils');
const dbModels = require(path.join(process.env.PWD, 'app/server/models'));

const { colleges } = require('../../dbseed/seed');

import app from '../../../../app/server/server';

describe('/api/college/:fullName', () => {
  var sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('GET', () => {
    it('should return a JSON description of an existing college from the DB', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/college/CUNY BERNARD M. BARUCH COLLEGE')
          },
          response: {
            'status': 200,
            'body.opeid': "7273-00",
            'body.shortName': "Baruch",
            'body.city': "New York",
            'body.percentPellGrant': 0.4401
          }
        }, {
          request: {
            method: 'get',
            url: encodeURI('/api/college/CUNY LEHMAN COLLEGE')
          },
          response: {
            'status': 200,
            'body.opeid': "7022-00",
            'body.shortName': "Lehman",
            'body.city': "Bronx",
            'body.percentPellGrant': 0.531
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return a 404 for a college that does not exist in the DB', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/college/randomName')
          },
          response: {
            'status': 404,
          }
        }, {
          request: {
            method: 'get',
            url: encodeURI('/api/college/QAZWSXEDC')
          },
          response: {
            'status': 404,
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return 500 for a server error', (done) => {
      const tests = [
        {
          request: {
            method: 'get',
            url: encodeURI('/api/college/CUNY BERNARD M. BARUCH COLLEGE')
          },
          response: {
            'status': 500,
          }
        }, {
          request: {
            method: 'get',
            url: encodeURI('/api/college/CUNY LEHMAN COLLEGE')
          },
          response: {
            'status': 500,
          }
        }
      ];

      sandbox.mock(dbModels.College)
        .expects('findOne')
        .rejects(new Error());

      testRoute(app, tests, done);
    });
  });

  describe('POST', () => {
    // Route currently unimplemented
  });

  describe('PUT', () => {
    it('should update an existing college with new values', (done) => {
      const tests = [
        {
          request: {
            method: 'put',
            url: encodeURI('/api/college/CUNY BERNARD M. BARUCH COLLEGE'),
            body: {
              'percentPellGrant': 0.5,
            }
          },
          response: {
            'status': 200,
            'body.opeid': "7273-00",
            'body.shortName': "Baruch",
            'body.city': "New York",
            'body.percentPellGrant': 0.5
          }
        }, {
          request: {
            method: 'put',
            url: encodeURI('/api/college/CUNY LEHMAN COLLEGE'),
            body: {
              'percentPellGrant': 0.75,
            }
          },
          response: {
            'status': 200,
            'body.opeid': "7022-00",
            'body.shortName': "Lehman",
            'body.city': "Bronx",
            'body.percentPellGrant': 0.75
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return a 404 for a college that does not exist in the DB', (done) => {
      const tests = [
        {
          request: {
            method: 'put',
            url: encodeURI('/api/college/QAZWSXEDC'),
            body: {
              'percentPellGrant': 0.75,
            }
          },
          response: {
            'status': 404,
          }
        }, {
          request: {
            method: 'put',
            url: encodeURI('/api/college/randomName'),
            body: {
              'percentPellGrant': 0.75,
            }
          },
          response: {
            'status': 404,
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it('should return 500 for a server error', (done) => {
      const tests = [
        {
          request: {
            method: 'put',
            url: encodeURI('/api/college/CUNY BERNARD M. BARUCH COLLEGE'),
            body: {
              'percentPellGrant': 0.5,
            }
          },
          response: {
            'status': 500,
          }
        }, {
          request: {
            method: 'put',
            url: encodeURI('/api/college/CUNY LEHMAN COLLEGE'),
            body: {
              'percentPellGrant': 0.75,
            }
          },
          response: {
            'status': 500,
          }
        }
      ];

      sandbox.mock(dbModels.College)
        .expects('findOne')
        .rejects(new Error());

      testRoute(app, tests, done);
    });

    it('should return status 500 if saving the new version throws an error', (done) => {
      const tests = [
        {
          request: {
            method: 'put',
            url: encodeURI('/api/college/CUNY BERNARD M. BARUCH COLLEGE'),
            body: {
              'percentPellGrant': 0.5,
            }
          },
          response: {
            'status': 500,
          }
        }, {
          request: {
            method: 'put',
            url: encodeURI('/api/college/CUNY LEHMAN COLLEGE'),
            body: {
              'percentPellGrant': 0.75,
            }
          },
          response: {
            'status': 500,
          }
        }
      ];

      sandbox.mock(dbModels.College.prototype)
        .expects('save')
        .rejects(new Error());

      testRoute(app, tests, done);
    });
  });

  describe('DELETE', () => {
    // Route currently unimplemented
  });
});