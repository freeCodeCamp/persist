const _ = require('lodash');
const expect = require('expect');
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const request = require('supertest');
const sinon = require('sinon');

const app = require(path.join(process.env.PWD, 'app/server/server'))
  .default;

const { testRoute } = require('../../testUtils');
const { users } = require('../../dbseed/seed');
const TEST_FILE = path.join(process.env.PWD, 'test/server/data/studentData.csv');

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
      // TODO: I have been unable to figure out how to mock saveCSV.
      // I am tabling this test and similar tests for now until we figure out a way to do that.
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

    it('should return a status 500 error if the studentData is invalid', (done) => {
      // TODO: Test other ways of having invalid data
      const authHeader = 'JWT ' + jwt.sign(users[3], process.env.SECRET, {
        expiresIn: 100080
      });

      request(app)
        .post('/upload/studentData')
        .set('Authorization', authHeader)
        .set('Content-Type', 'multipart/form-data')
        .attach('file', null)
        .then((res) => {
          expect(res.status)
            .toBe(500);
          done();
        })
        .catch(done);

    });

    it('should return a status 500 error if no data is uploaded', (done) => {
      const authHeader = 'JWT ' + jwt.sign(users[3], process.env.SECRET, {
        expiresIn: 100080
      });

      request(app)
        .post('/upload/studentData')
        .set('Authorization', authHeader)
        .set('Content-Type', 'multipart/form-data')
        .then((res) => {
          expect(res.status)
            .toBe(500);
          done();
        })
        .catch(done);

    });
  });
});