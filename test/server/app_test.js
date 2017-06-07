const expect = require('expect');
const sinon = require('sinon');
const path = require('path');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));
const seed = require('./dbseed/seed');
const {populateServer} = require('./dbseed/seed');

const app = require('../../app/server/server.js')

beforeEach(populateServer);

describe('Testing Setup', () => {
  it('should seed database with college data for testing', (done) => {
    dbModels.College.find({}).then((colleges) => {
      const validators = [
        ({opeid}) => typeof opeid === 'string',
      ];

      verifySeed(colleges, seed.colleges.length, validators, done);
    });
  });

  it('should seed database with student data for testing', (done) => {
    dbModels.Student.find({}).then((students) => {
      const validators = [
        ({firstName}) => typeof firstName === 'string',
        ({lastName}) => typeof lastName === 'string',
        ({ethnicity}) => typeof ethnicity === 'number',
        ({gender}) => typeof gender === 'string',
      ];

      verifySeed(students, seed.students.length, validators, done);
    });
  });

  it('should seed database with school data for testing', (done) => {
    dbModels.School.find({}).then((schools) => {
      const validators = [
        ({name}) => typeof name === 'string',
      ];

      verifySeed(schools, seed.schools.length, validators, done);
    });
  });

  it('should seed database with user accounts for testing', (done) => {
    dbModels.User.find({}).then((users) => {
      const validators = [
        ({profile: {firstName}}) => typeof firstName === 'string',
        ({email}) => typeof email === 'string',
        ({password}) => typeof password === 'undefined', // user.password has select: false in its Schema
        ({enabled}) => typeof enabled === 'boolean',
      ];

      verifySeed(users, seed.users.length, validators, done);
    });
  });

  function verifySeed(collection, expectedCount, validators, done) {
    try {
      expect(collection.length).toBe(expectedCount);
    } catch (err) {
      return done(err);
    }
    Promise.all(collection.map(doc => validators.every(valid => valid(doc))))
    .then(results => {
      try {
        expect(results.every(result => result === true)).toBe(true);
        done();
      } catch (err) {
        done(err);
      }
    });
  }
});

require('./test_models');
require('./test_routes');
