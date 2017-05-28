const path = require('path');

const modelsDir = path.join(process.env.PWD, 'app/server/models/');
const {College, Notification, School, Student, UploadHistory, User} = require(modelsDir);

const commonDir = path.join(process.env.PWD, 'app/common/');
const {ROLE_ADMIN, ROLE_OWNER, ROLE_COUNSELOR} = require(path.join(commonDir, 'constants'));

const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const SALT_FACTOR = 5; //should match value in models/user.js
const pwdSalt = bcrypt.genSaltSync(SALT_FACTOR);


const adminID = new ObjectID();
const userOneID = new ObjectID();
const schoolOneID = new ObjectID();
const userTwoID = new ObjectID();
const userThreeID = new ObjectID();
const users = [
  {
    profile: {
        firstName: 'Sachin',
        lastName: 'Mour'
    },
    email: 'rtr.sachinmour@gmail.com',
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin', pwdSalt),
    access: {
        role: 'Admin' // Why is this not ROLE_ADMIN?
    },
    enabled: true
  }, {
    _id: userOneID,
    email: 'userone@test.com',
    password: bcrypt.hashSync('userOnePass', pwdSalt),
    profile: {
      firstName: 'User',
      lastName: 'One'
    },
    enabled: true,
    access: {
      role: ROLE_ADMIN,
      school: schoolOneID,
    },
  }, {
    _id: userTwoID,
    email: 'usertwo@test.com',
    password: bcrypt.hashSync('userTwoPass', pwdSalt),
    profile: {
      firstName: 'User',
      lastName: 'Two'
    },
    enabled: true,
    access: {
      role: ROLE_COUNSELOR,
      school: schoolOneID,
    },
  }, {
    _id: userThreeID,
    email: 'userThree@test.com',
    password: bcrypt.hashSync('userThreePass', pwdSalt),
    profile: {
      firstName: 'User',
      lastName: 'Three'
    },
    enabled: true,
    access: {
      role: ROLE_OWNER,
      school: schoolOneID,
    },
  }
];

const populateServer = (done) => {
  done();
};


/**
 * populateUsers - clears users collection from mongoDB database and replaces it
 *                with array of users above.  Used in beforeEach mocha test hook
 *                to allow tests to run against a fixed DB.
 *
 * @param  {function} done callback function for async tests in mocha
 */
const populateUsers = (done) => {
  User
    .remove({})
    .then(() => {
      return Promise.all(
        users.map((user) => {
          return new User(user).save();
      }));

      let userOne = new User(users[0]).save();
      let userTwo = new User(users[1]).save();
      let userThree = new User(users[2]).save();

      return Promise.all([userOne, userTwo, userThree]);
    }).then(() => done());
};

module.exports = {
  populateServer,
  populateUsers,
  users,
};
