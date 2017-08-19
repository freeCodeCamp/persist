const _ = require('lodash');
const expect = require('expect');
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const proxyquire = require('proxyquire');
const request = require('supertest');
const sinon = require('sinon');
const { testRoute } = require('../../testUtils');

const mockModule = '../utils/save_csv';
const proxyMethods = {};
proxyMethods[mockModule] = { default: sinon.spy() };

process.env.PORT = 3000;
const routes = proxyquire(path.join(process.env.PWD, 'app/server/routes'), proxyMethods)
  .default;
const app = proxyquire('../../../../app/server/server', { './routes/index': routes })
  .default;

const { users } = require('../../dbseed/seed');
const TEST_FILE = path.join(process.env.PWD, 'test/server/test_routes/upload/data/sD.csv');

describe('/upload/studentData', () => {
  var sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('POST', () => {

    it('should respond with status 401 for an unauthorized user', (done) => {
      const tests = [
        {
          request: {
            method: 'post',
            url: encodeURI('/upload/studentData')
          },
          response: {
            status: 401
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it.skip('should pass uploaded file to saveCSV function', (done) => {
      const authHeader = 'JWT ' + jwt.sign(users[3], process.env.SECRET, {
        expiresIn: 100080
      });

      request(app)
        .post('/upload/studentData')
        .set('Authorization', authHeader)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', TEST_FILE)
        .then((res) => {
          console.log(res.status);
          console.log(res.body);
          console.log(res.text);
          sinon.assert.calledOnce(proxyMethods[mockModule]);
          done();
        })
        .catch(done);
    });

    it.skip('should return a status 500 error if the studentData is invalid', () => {});

    it.skip('should return a status 500 error if no data is uploaded', () => {});
  });
});