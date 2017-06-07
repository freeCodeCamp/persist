const expect = require('expect');
const sinon = require('sinon');
const path = require('path');
const {ObjectID} = require('mongodb');
const validator = require('../../../app/common/validator');
const {map} = require('lodash');
const {testModel} = require('../testUtils');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));

describe('user', () => {
  it.skip('should require a unique email address', () => {
    const validUsers = [
      { osis: 1 },            // Unused value
    ];
    const invalidUsers = [
      { osis: 1 },            // Duplicate value
    ];

    testModel(dbModels.User, validUsers, invalidUsers, done);
  });

  it.skip('should reject invalid email addresses', () => {});

  it.skip('should require a password', () => {});

  it.skip('should not include password in query responses', () => {});

  it.skip('should require a profile.firstName value', () => {});

  it.skip('should validate the access value', () => {});
});
