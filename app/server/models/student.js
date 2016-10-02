const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Parent = {
  relationship: String,
  name: String,
  mobile: Number,
  textable: Boolean,
  workPhone: Number,
  OtherPhone: [Number]
};

const termSchema = {
  name: String,
  status: String,
  college: String,
  recordType: String
};

export const Student = new Schema({

  firstName: {
    type: String,
    index: true
  },
  lastName: String,
  middleName: String,
  suffix: String,
  altName: String,
  hsGradYear: Number,
  tags: {
    type: [String],
    validate: {

      validator: function(v, cb) {

        const possibles = ['SPED', 'Free Lunch Eligible', 'ELL'];
        var output = true;
        v.forEach(function(str) {
          if (!possibles.includes(str)) {
            output = false;
            return;
          }
        });
        if (output) {
          return true;
        } else {
          return cb(false);
        }
      },
      message: '{VALUE} is not a valid phone number!'
    }
  },

  edHistNo: String,
  recType: String,
  schoolAccName: String,
  schoolType: String,
  enrollmentStatus: String,
  termName: String,
  termStartDate: Date,
  termEndDate: Date,
  termGPA: Number,
  cumulativeGPA: Number,
  creditHoursAttempted: Number,
  creditHoursGradEarned: Number,
  remedialHoursEarned: Number,
  termID: String,
  educationalHistory: String,
  contactID: {
    type: String,
    index: true
  },
  dob: Date,
  mobile: Number,
  textable: Boolean,
  homePhone: Number,
  otherPhone: String,
  email: String,
  lastModifiedDate: Date,
  lastModifiedBy: String,
  parentGuardian: [Parent],
  hsID: Number,
  hsAttended: String,
  cellPhone: String,
  email1: String,
  email2: String,
  parentName: String,
  parentContact: String,
  majorMinor: String,
  mostRecentColEmp: String,
  tranferStatus: String,
  studentSupportOrgName: String,
  notes: String,
  cohort: String,
  hsGradDate: Date,
  iniEnrollDate: Date,
  ethnicity: String,
  gender: String,
  intendedCollege: String,
  SAT: {
    math: Number,
    cr: Number
  },
  actEquiv: Number,
  hsGPA: Number,
  terms: {
    type: Array,
    default: [termSchema]
  }
});

export default mongoose.model('Student', Student);
