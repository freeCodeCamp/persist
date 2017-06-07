const expect = require('expect');
const sinon = require('sinon');
const path = require('path');
const {ObjectID} = require('mongodb');
const validator = require('../../../app/common/validator');
const {map} = require('lodash');
const {testModel} = require('../testUtils');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));

describe('student', () => {
  const {enums} = validator;

  it('should require a unique osis value', (done) => {
    const validStudents = [
      { osis: 1 },            // Unused value
    ];
    const invalidStudents = [
      { osis: 1 },            // Duplicate value
    ];

    testModel(dbModels.Student, validStudents, invalidStudents, done);
  });

  it('should only allow an ethnicity integer in range [1,7]', (done) => {
    const validStudents = [
      { ethnicity: 1, osis: 1 },
      { ethnicity: 7, osis: 2 },
    ];
    const invalidStudents = [
      { ethnicity: 0, osis: 3 },
      { ethnicity: 8, osis: 4 },
    ];

    testModel(dbModels.Student, validStudents, invalidStudents, done);
  });
});
