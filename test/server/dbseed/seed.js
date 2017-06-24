const path = require('path');

const modelsDir = path.join(process.env.PWD, 'app/server/models/');
const models = require(modelsDir);

const commonDir = path.join(process.env.PWD, 'app/common/');
const {ROLE_ADMIN, ROLE_OWNER, ROLE_COUNSELOR} = require(path.join(commonDir, 'constants'));

const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const SALT_FACTOR = 5; //should match value in models/user.js
const pwdSalt = bcrypt.genSaltSync(SALT_FACTOR);

const adminID = new ObjectID();

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const userThreeID = new ObjectID();

const schoolOneID = new ObjectID();
const schoolTwoID = new ObjectID();

const studentOneID = new ObjectID();
const studentTwoID = new ObjectID();
const studentThreeID = new ObjectID();

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

const schools = [
  {
    "_id": ObjectID("58d453aa97fb3c001846f4ce"),
    "name": "Baldwin",
    "users": [],
    "__v": 0
  }, {
    "_id": ObjectID("58d453aa97fb3c001846f4cf"),
    "name": "Brooklyn Collaborative",
    "users": [],
    "__v": 0
  }, {
    "_id": ObjectID("58d453aa97fb3c001846f4d0"),
    "name": "Channel View",
    "users": [],
    "__v": 0
  }
];

const students = [
  {
    "_id": studentOneID,
    "expectedHSGrad": new Date("2014-09-15T00:00:00.000Z"),
    "hs": schoolOneID,
    "osis": 200205492,
    "lastName": "Jonson",
    "firstName": "Jon",
    "dob": new Date("1996-07-06T00:00:00.000Z"),
    "cohort": "P (2010)",
    "hsGradDate": new Date("2014-07-01T00:00:00.000Z"),
    "ethnicity": 3,
    "hsDiplomaType": "REGENTS",
    "fullName": "Jon Jonson",
    "photoReleaseForm": false,
    "needsFollowup": false,
    "applications": [
      {
        "college": ObjectID("5912330b53b2a665af3d069f"),
        "type": "RD",
        "result": "Unknown",
        "notes": "LIFL, MIN",
        "_id": ObjectID("591479067066b1747ff9fc4b"),
        "defer": false,
        "attending": false
      }, {
        "college": ObjectID("5912330b53b2a665af3d06a1"),
        "type": "RD",
        "result": "Unknown",
        "notes": "LIFL, MIN",
        "_id": ObjectID("591479067066b1747ff9fc4c"),
        "defer": false,
        "attending": false
      }, {
        "college": ObjectID("5912330b53b2a665af3d06a4"),
        "type": "RD",
        "result": "Unknown",
        "notes": "LIFL, MIN",
        "_id": ObjectID("591479067066b1747ff9fc4d"),
        "defer": false,
        "attending": false
      }, {
        "college": ObjectID("5912330b53b2a665af3d06a2"),
        "type": "RD",
        "result": "Unknown",
        "notes": "LIFL, MIN",
        "_id": ObjectID("591479067066b1747ff9fc4e"),
        "defer": false,
        "attending": false
      }, {
        "college": ObjectID("5912330b53b2a665af3d069a"),
        "type": "RD",
        "result": "Unknown",
        "notes": "LIFL, MIN",
        "_id": ObjectID("591479067066b1747ff9fc4f"),
        "defer": false,
        "attending": false
      }
    ],
    "caseNotes": [],
    "documents": [],
    "graduations": [],
    "terms": [
      {
        "college": ObjectID("5912330b53b2a665af3d06a2"),
        "_id": ObjectID("59149e028ecd43144d9241e8"),
        "degreeTitle": [],
        "recordType": "NSC"
      }, {
        "college": ObjectID("5912330b53b2a665af3d06a2"),
        "_id": ObjectID("59149e028ecd43144d9241e7"),
        "degreeTitle": [],
        "recordType": "NSC"
      }, {
        "college": ObjectID("5912330b53b2a665af3d06a2"),
        "name": "Fall 2015",
        "enrolBegin": new Date("2015-08-27T00:00:00.000Z"),
        "enrolEnd": new Date("2015-11-09T00:00:00.000Z"),
        "_id": ObjectID("591ce136c74a7865d5f5d6bf"),
        "degreeTitle": [],
        "recordType": "NSC"
      }, {
        "college": ObjectID("5912330b53b2a665af3d06a2"),
        "name": "Spring 2015",
        "enrolBegin": new Date("2015-01-28T00:00:00.000Z"),
        "enrolEnd": new Date("2015-05-24T00:00:00.000Z"),
        "_id": ObjectID("591ce136c74a7865d5f5d6c0"),
        "degreeTitle": [],
        "recordType": "NSC"
      }
    ],
    "taxDocumentsSubmitted": false,
    "studentAidReportReceived": false,
    "startedFafsa": false,
    "parentName": [],
    "parentContact": [],
    "opportunityProgramEligible": false,
    "lettersOfRecommendation": false,
    "eaEdApplications": false,
    "cssProfileCreated": false,
    "completedTap": false,
    "completedFafsa": false,
    "completedEssay": false,
    "awardLetterReceived": false,
    "attendingMeetupDay": false,
    "appliedToOtherSupportProgram": false,
    "transferStatus": [],
    "remediationStatus": [],
    "majorMinor": [],
    "employmentStatus": [],
    "studentSupportOrgName": [],
    "descriptors": [],
    "otherPhone": [],
    "needGap": false,
    "ferpa": false,
    "email": [],
    "nscRecordFound": true,
    "alias": false,
    "aliases": [],
    "SAT": {
      "cr": 350,
      "math": 440
    },
    "actEquiv": 14,
    "hsGPA": 72.19,
    "psat": 1190,
    "cunyApp": "Completed",
    "firstCol": ObjectID("5912330b53b2a665af3d06a2"),
    "mostRecentCol": ObjectID("5912330b53b2a665af3d06a2"),
    "cellPhone": "(555) 555-5555",
    "gender": "M",
    "address": "86 Nowheresville, NA 75309"
  }, {
    "_id": studentTwoID,
    "expectedHSGrad": new Date("2015-09-15T00:00:00.000Z"),
    "hs": schoolOneID,
    "osis": 209287145,
    "lastName": "Ymous",
    "firstName": "Anon",
    "dob": new Date("1997-02-20T00:00:00.000Z"),
    "cohort": "Q (2011)",
    "hsGradDate": new Date("2015-07-01T00:00:00.000Z"),
    "ethnicity": 4,
    "hsDiplomaType": "REGENTS",
    "fullName": "Anon Ymous",
    "photoReleaseForm": false,
    "needsFollowup": false,
    "applications": [],
    "caseNotes": [],
    "documents": [],
    "graduations": [],
    "terms": [
      {
        "college": ObjectID("5912332753b2a665af3d1784"),
        "enrolBegin": new Date("2017-01-01T00:00:00.000Z"),
        "enrolEnd": new Date("2017-05-12T00:00:00.000Z"),
        "_id": ObjectID("591490557066b1747ffa28c4"),
        "degreeTitle": [],
        "recordType": "Counselor Added"
      }, {
        "name": "Fall 2016",
        "college": ObjectID("5912332753b2a665af3d1784"),
        "enrolBegin": new Date("2016-09-01T00:00:00.000Z"),
        "enrolEnd": new Date("2016-12-15T00:00:00.000Z"),
        "_id": ObjectID("591490557066b1747ffa28c3"),
        "degreeTitle": [],
        "recordType": "Counselor Added"
      }, {
        "college": ObjectID("5912332753b2a665af3d1784"),
        "enrolBegin": new Date("2016-01-01T00:00:00.000Z"),
        "enrolEnd": new Date("2016-05-14T00:00:00.000Z"),
        "_id": ObjectID("591490557066b1747ffa28c5"),
        "degreeTitle": [],
        "recordType": "Counselor Added"
      }
    ],
    "taxDocumentsSubmitted": false,
    "studentAidReportReceived": false,
    "startedFafsa": false,
    "parentName": [],
    "parentContact": [],
    "opportunityProgramEligible": false,
    "lettersOfRecommendation": false,
    "eaEdApplications": false,
    "cssProfileCreated": false,
    "completedTap": false,
    "completedFafsa": false,
    "completedEssay": false,
    "awardLetterReceived": false,
    "attendingMeetupDay": false,
    "appliedToOtherSupportProgram": false,
    "transferStatus": [],
    "remediationStatus": [],
    "majorMinor": [],
    "employmentStatus": [],
    "studentSupportOrgName": [],
    "descriptors": [],
    "otherPhone": [],
    "needGap": false,
    "ferpa": false,
    "email": [],
    "nscRecordFound": true,
    "alias": false,
    "aliases": [],
    "firstCol": ObjectID("5912332753b2a665af3d1784"),
    "mostRecentCol": ObjectID("5912332753b2a665af3d1784"),
    "cellPhone": "(555) 555-5555",
    "gender": "F",
    "studentSupportOrgNameOther": "No answer, emailed 8/16",
    "SAT": {
      "math": 370,
      "cr": 380
    },
    "hsGPA": 79.71,
    "intendedCollege": ObjectID("5912330b53b2a665af3d06a4")
  }, {
    "_id": studentThreeID,
    "expectedHSGrad": new Date("2015-09-15T00:00:00.000Z"),
    "hs": schoolTwoID,
    "osis": 20927145,
    "lastName": "Ymous",
    "firstName": "Anon",
    "dob": new Date("1997-02-20T00:00:00.000Z"),
    "cohort": "Q (2011)",
    "hsGradDate": new Date("2015-07-01T00:00:00.000Z"),
    "ethnicity": 4,
    "hsDiplomaType": "REGENTS",
    "fullName": "Anon Ymous",
    "photoReleaseForm": false,
    "needsFollowup": false,
    "applications": [],
    "caseNotes": [],
    "documents": [],
    "graduations": [],
    "terms": [
      {
        "college": ObjectID("5912332753b2a665af3d1784"),
        "enrolBegin": new Date("2017-01-01T00:00:00.000Z"),
        "enrolEnd": new Date("2017-05-12T00:00:00.000Z"),
        "_id": ObjectID("591490557066b1747ffa28c4"),
        "degreeTitle": [],
        "recordType": "Counselor Added"
      }, {
        "name": "Fall 2016",
        "college": ObjectID("5912332753b2a665af3d1784"),
        "enrolBegin": new Date("2016-09-01T00:00:00.000Z"),
        "enrolEnd": new Date("2016-12-15T00:00:00.000Z"),
        "_id": ObjectID("591490557066b1747ffa28c3"),
        "degreeTitle": [],
        "recordType": "Counselor Added"
      }, {
        "college": ObjectID("5912332753b2a665af3d1784"),
        "enrolBegin": new Date("2016-01-01T00:00:00.000Z"),
        "enrolEnd": new Date("2016-05-14T00:00:00.000Z"),
        "_id": ObjectID("591490557066b1747ffa28c5"),
        "degreeTitle": [],
        "recordType": "Counselor Added"
      }
    ],
    "taxDocumentsSubmitted": false,
    "studentAidReportReceived": false,
    "startedFafsa": false,
    "parentName": [],
    "parentContact": [],
    "opportunityProgramEligible": false,
    "lettersOfRecommendation": false,
    "eaEdApplications": false,
    "cssProfileCreated": false,
    "completedTap": false,
    "completedFafsa": false,
    "completedEssay": false,
    "awardLetterReceived": false,
    "attendingMeetupDay": false,
    "appliedToOtherSupportProgram": false,
    "transferStatus": [],
    "remediationStatus": [],
    "majorMinor": [],
    "employmentStatus": [],
    "studentSupportOrgName": [],
    "descriptors": [],
    "otherPhone": [],
    "needGap": false,
    "ferpa": false,
    "email": [],
    "nscRecordFound": true,
    "alias": false,
    "aliases": [],
    "firstCol": ObjectID("5912332753b2a665af3d1784"),
    "mostRecentCol": ObjectID("5912332753b2a665af3d1784"),
    "cellPhone": "(555) 555-5555",
    "gender": "F",
    "studentSupportOrgNameOther": "No answer, emailed 8/16",
    "SAT": {
      "math": 370,
      "cr": 380
    },
    "hsGPA": 79.71,
    "intendedCollege": ObjectID("5912330b53b2a665af3d06a4")
  }
];

const collections = [
  {
    model: models.User,
    collection: users
  }, {
    model: models.College,
    collection: colleges
  }, {
    model: models.School,
    collection: schools
  }, {
    model: models.Student,
    collection: students
  }
];

/**
 * populateServer - clears all collections from mongoDB database and replaces them
 *                with collections listed above.  Used in beforeEach mocha test hook
 *                to allow tests to run against a fixed DB.
 *
 * @param  {function} done callback function for async tests in mocha
 */
const populateServer = (done) => {
  Promise.all(collections.map(({model, collection}) => {
    return model.remove({}).then(() => {
      return collection.map((doc) => {
        return new model(doc).save();
      });
    });
  })).then(() => {
    // HACK Issues with done being called too soon.
    setTimeout(done, 100);
  });
};

module.exports = {
  users,
  colleges,
  schools,
  students,
  populateServer
};
