const expect = require('expect');
const sinon = require('sinon');

const {populateUsers} = require('./dbseed/seed');
const app = require('../../server.js')

beforeEach(populateUsers);

describe('Testing Setup', () => {
  it('should seed database with user accounts for testing', () => {
    expect(1).toBe(1);
  });
});
