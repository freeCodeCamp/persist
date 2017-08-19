const _ = require('lodash');
const expect = require('expect');
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const request = require('supertest');
const sinon = require('sinon');

// const routes = require(path.join(process.env.PWD, 'app/server/routes'));
const app = require(path.join(process.env.PWD, 'app/server/server'))
  .default;

const { users } = require('../../dbseed/seed');
const { testRoute } = require('../../testUtils');

describe('/upload/termData', () => {
  describe('POST', () => {

    it('should respond with status 401 for an unauthorized user', (done) => {
      const tests = [
        {
          request: {
            method: 'post',
            url: encodeURI('/upload/termData')
          },
          response: {
            status: 401
          }
        }
      ];

      testRoute(app, tests, done);
    });

    it.skip('should save valid termData uploaded as a csv file', () => {});

    it('should return a status 500 error if the termData is invalid', (done) => {
      // TODO: Test other ways of having invalid data
      const authHeader = 'JWT ' + jwt.sign(users[3], process.env.SECRET, {
        expiresIn: 100080
      });

      request(app)
        .post('/upload/termData')
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
        .post('/upload/termData')
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