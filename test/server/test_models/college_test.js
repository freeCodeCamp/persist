const expect = require('expect');
const sinon = require('sinon');
const path = require('path');
const {ObjectID} = require('mongodb');
const validator = require('../../../app/common/validator');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));

describe('college', () => {
  it('should require a unique opeid field', (done) => {
    const validCollege = new dbModels.College({
      opeid: 'opeid',
    });

    const invalidColleges = [
      new dbModels.College({opeid: 'opeid'}),       // Duplicate -- Opeids must be unique
      new dbModels.College({fullName: 'fullName'})  // Lacks required opeid
    ];

    validCollege.save((err, college) => {
      if (err) {
        return done(err);
      }

      invalidColleges.forEach((college) => {
        college.save((err, success) => {
          if (success) {
            done(new Error(`College model should not save ${success}`));
          }
        });
      });
    }).then(() => done());
  });
});
