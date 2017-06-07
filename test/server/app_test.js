const expect = require('expect');
const sinon = require('sinon');
const path = require('path');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));
const seed = require('./dbseed/seed');
const {populateServer} = require('./dbseed/seed');
const {testSeed} = require('./testUtils');

const app = require('../../app/server/server.js')

beforeEach(populateServer);

describe('Testing Setup', () => {
  it('should seed database with college data for testing', (done) => {
    dbModels.College.find({}).then((colleges) => {
      const validators = [
        ({opeid}) => typeof opeid === 'string',
      ];

      testSeed(colleges, seed.colleges.length, validators, done);
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

      testSeed(students, seed.students.length, validators, done);
    });
  });

  it('should seed database with school data for testing', (done) => {
    dbModels.School.find({}).then((schools) => {
      const validators = [
        ({name}) => typeof name === 'string',
      ];

      testSeed(schools, seed.schools.length, validators, done);
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

      testSeed(users, seed.users.length, validators, done);
    });
  });
});

require('./test_models');
require('./test_routes');
