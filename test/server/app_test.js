const expect = require('expect');
const sinon = require('sinon');
const path = require('path');

const {populateUsers} = require('./dbseed/seed');
const dbModels = require(path.join(process.env.PWD, 'app/server/models'));
const app = require('../../server.js')

beforeEach(populateUsers);

describe('Testing Setup', () => {
  it('should seed database with user accounts for testing', (done) => {
    dbModels.User.find({}).then((users) => {
      expect(users.length).toBe(4);

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
