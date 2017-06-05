const expect = require('expect');
const sinon = require('sinon');
const path = require('path');
const {ObjectID} = require('mongodb');
const validator = require('../../../app/common/validator');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));

describe('school', () => {
  it('should require a name field', (done) => {
    const validSchool = new dbModels.School({name: 'Generic High School'});

    const invalidSchools = [
      new dbModels.School({_id: new ObjectID()})
    ];

    validSchool.save((err, school) => {
      if (err) {
        done(err);
      }

      invalidSchools.forEach((school) => {
        school.save((err, success) => {
          if(success) {
            done(new Error(`School model should not save ${success}`));
          }
        });
      });
    }).then(() => done());
  });

  it('should accept an array of users ids', (done) => {
    const users = [
      new ObjectID(),
      new ObjectID(),
      new ObjectID(),
    ];
    const validSchool = new dbModels.School({name: 'Generic High School', users});

    validSchool.save((err, success) => {
      if(err) {
        done(err)
      }
    }).then(() => done());
  });
});
