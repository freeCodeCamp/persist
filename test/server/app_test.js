const expect = require('expect');
const sinon = require('sinon');
const path = require('path');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));
const {populateServer} = require('./dbseed/seed');

const app = require('../../app/server/server.js')

beforeEach(populateServer);

describe('Testing Setup', () => {
  it('should seed database with user accounts for testing', (done) => {
    dbModels.User.find({}).then((users) => {
      try {
        expect(users.length).toBe(4);
      } catch (err) {
        return done(err);
      }

      const validators = [
        ({profile: {firstName}}) => typeof firstName === 'string',
        ({email}) => typeof email === 'string',
        ({password}) => typeof password === 'undefined', // user.password has select: false in its Schema
        ({enabled}) => typeof enabled === 'boolean',
      ];

      Promise.all(users.map(user => validators.every(valid => valid(user))))
        .then(results => {
          try {
            expect(results.every(result => result === true)).toBe(true);
            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });
});

require('./test_models');

describe('Server Routes', () => {
  require('./test_routes/upload/applicationData');
  require('./test_routes/upload/collegeData');
  require('./test_routes/upload/schoolData');
  require('./test_routes/upload/termData');
});
