const expect = require('expect');
const sinon = require('sinon');
const path = require('path');
const {ObjectID} = require('mongodb');


const dbModels = require(path.join(process.env.PWD, 'app/server/models'));

describe('MongoDB models', () => {
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

  describe('notification', () => {
    // Not sure what to test here as no values are required or validated in the DB model
  });

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

  describe('student', () => {

  });

  describe('uploadHistory', () => {});

  describe('user', () => {});
});
