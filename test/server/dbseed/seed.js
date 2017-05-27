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

const userOneID = new ObjectID();
const schoolOneID = new ObjectID();
const userTwoID = new ObjectID();
const userThreeID = new ObjectID();
const users = [
  {
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

};

const populateUsers = (done) => {
  User
    .remove({})
    .then(() => {
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
