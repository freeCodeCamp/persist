const path = require('path');

const modelsDir = path.join(process.env.PWD, 'app/server/models/');
const {
  College,
  Notification,
  School,
  Student,
  UploadHistory,
  User
} = require(modelsDir);

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
      school: schoolOneID
    }
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
      school: schoolOneID
    }
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
      school: schoolOneID
    }
  }
];

const colleges = [
  {
    "_id": ObjectID("5912330a53b2a665af3d0692"),
    "opeid": "7273-00",
    "collegeScorecardName": "CUNY Bernard M Baruch College",
    "fullName": "CUNY BERNARD M. BARUCH COLLEGE",
    "shortName": "Baruch",
    "navianceName": "Baruch College of the CUNY",
    "testingPolicy": "Required",
    "barronsRating": "Very Selective",
    "avgHsGpa": 3.14,
    "city": "New York",
    "state": "NY",
    "collType": 1,
    "zipcode": "10010",
    "website": "www.baruch.cuny.edu",
    "netPriceCalculator": "https://portal0.uapc.cuny.edu/uapc/public/fin_aid/financial_aid_estimator/FinAidEstimator.jsp",
    "admissionsRate": 0.279,
    "percentileCR25": 540,
    "percentileCR75": 640,
    "percentileMath25": 600,
    "percentileMath75": 690,
    "numberStudents": 14420,
    "percentPartTimeEnrolled": 0.2513,
    "percentPellGrant": 0.4401,
    "durationType": "4 year",
    "locale": "City:Large",
    "hbcu": "No",
    "womenOnly": true,
    "percentDegrees2": 0.01,
    "percentDegrees3": 0.04,
    "percentDegrees7": 0.03,
    "percentDegrees8": 0.01,
    "percentDegrees9": 0.01,
    "percentDegrees11": 0.1,
    "percentDegrees13": 0.01,
    "percentDegrees15": 0.01,
    "percentDegrees16": 0.78,
    "netPrice0to30": 5318,
    "netPrice30to48": 7125,
    "netPrice48to75": 10845,
    "freshRetRate": 0.76,
    "percentStudents": {
      "white": 0.2503,
      "black": 0.0931,
      "hispanic": 0.1924,
      "asian": 0.3284
    },
    "gradRate": {
      "overall": 0.66,
      "white": 0.65,
      "black": 0.6,
      "hispanic": 0.57
    },
    "__v": 0
  }, {
    "_id": ObjectID("5912330a53b2a665af3d0693"),
    "opeid": "7022-00",
    "collegeScorecardName": "CUNY Lehman College",
    "fullName": "CUNY LEHMAN COLLEGE",
    "shortName": "Lehman",
    "navianceName": "Lehman College of the CUNY",
    "testingPolicy": "Required",
    "barronsRating": "Nonselective",
    "city": "Bronx",
    "state": "NY",
    "collType": 1,
    "zipcode": "10468",
    "website": "www.lehman.cuny.edu",
    "netPriceCalculator": "https://portal0.uapc.cuny.edu/uapc/public/fin_aid/financial_aid_estimator/FinAidEstimator.jsp",
    "admissionsRate": 0.2891,
    "percentileCR25": 460,
    "percentileCR75": 530,
    "percentileMath25": 470,
    "percentileMath75": 530,
    "numberStudents": 9417,
    "percentPartTimeEnrolled": 0.3773,
    "percentPellGrant": 0.531,
    "durationType": "4 year",
    "locale": "City:Large",
    "hbcu": "No",
    "womenOnly": true,
    "percentDegrees2": 0.02,
    "percentDegrees3": 0.04,
    "percentDegrees5": 0.03,
    "percentDegrees7": 0.06,
    "percentDegrees8": 0.31,
    "percentDegrees9": 0.01,
    "percentDegrees11": 0.22,
    "percentDegrees12": 0.01,
    "percentDegrees13": 0.08,
    "percentDegrees15": 0.03,
    "percentDegrees16": 0.19,
    "netPrice0to30": 954,
    "netPrice30to48": 3417,
    "netPrice48to75": 7798,
    "freshRetRate": 0.89,
    "percentStudents": {
      "white": 0.0691,
      "black": 0.2778,
      "hispanic": 0.546,
      "asian": 0.0617
    },
    "gradRate": {
      "overall": 0.37,
      "white": 0.51,
      "black": 0.38,
      "hispanic": 0.34
    },
    "__v": 0
  }
];

/**
 * populateUsers - clears users collection from mongoDB database and replaces it
 *                with array of users above.  Used in beforeEach mocha test hook
 *                to allow tests to run against a fixed DB.
 *
 * @param  {function} done callback function for async tests in mocha
 */
const populateUsers = (done) => {
  User.remove({}).then(() => {
    return Promise.all(users.map((user) => {
      return new User(user).save();
    }));
  }).then(() => done());
};

/**
 * populateColleges - clears colleges collection from mongoDB database and replaces it
 *                with array of colleges above.  Used in beforeEach mocha test hook
 *                to allow tests to run against a fixed DB.
 *
 * @param  {function} done callback function for async tests in mocha
 */
const populateColleges = (done) => {
  College.remove({}).then(() => {
    return Promise.all(colleges.map((college) => {
      return new College(college).save();
    }));
  }).then(() => done());
};

module.exports = {
  users,
  colleges,
  populateUsers,
  populateColleges
};
