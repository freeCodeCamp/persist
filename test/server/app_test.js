const expect = require('expect');
const sinon = require('sinon');
const path = require('path');

const dbModels = require(path.join(process.env.PWD, 'app/server/models'));
const {populateServer} = require('./dbseed/seed');

const app = require('../../app/server/server.js')

beforeEach(populateServer);

describe('Testing Setup', () => {
  it('should seed database for testing', (done) => {
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
require('./test_routes');
