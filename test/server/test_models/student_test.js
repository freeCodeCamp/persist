const expect = require('expect');
const sinon = require('sinon');
const path = require('path');
const {ObjectID} = require('mongodb');
const validator = require('../../../app/common/validator');
const {map} = require('lodash');

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

    const saveStudent = student => new dbModels.Student(student).save();

    Promise.all(validStudents.map(saveStudent))
      .then(() => Promise.all(invalidStudents.map(saveStudent))
                    .then(success => done(new Error(`Student model should not save ${success}`)))
                    .catch(err => done()))
      .catch(done);
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

    const saveStudent = student => new dbModels.Student(student).save();

    Promise.all(map(validStudents, saveStudent))
      .then(() => Promise.all(map(invalidStudents, saveStudent))
                    .then(success => done(new Error(`Student model should not save ${success}`)))
                    .catch(err => done()))
      .catch(done);
  });

  it.skip('should validate the descriptors field', () => {});

  it.skip('should validate the studentSupportOrgName field', () => {});

  it.skip('should validate the employmentStatus field', () => {});

  it.skip('should validate the remediationStatus field', () => {});

  it.skip('should validate the transferStatus field', () => {});
});
