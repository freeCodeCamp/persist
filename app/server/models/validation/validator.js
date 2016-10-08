export const messages = {
  default: 'You tried to add `{VALUE}` to `{PATH}` which is forbidden'
};

export const enums = {
  hsAttended: {
    values: [
      'Baldwin',
      'Brooklyn Collaborative',
      'Channel View',
      'Kurt Hahn',
      'Leaders',
      'MELS',
      'McCown',
      'WHEELS'
    ],
    message: messages.default
  },
  gender: {
    values: [
      'M', 'F'
    ],
    message: messages.default
  },
  ferpa: {
    values: [
      'Yes', 'No'
    ],
    message: messages.default
  },
  cohort: {
    values: [
      'M (2007)',
      'N (2008)',
      'O (2009)',
      'P (2010)',
      'Q (2011)',
      'R (2012)',
      'S (2013)',
      'T (2014)',
      'U (2015)',
      'V (2016)',
      'W (2017)',
      'X (2018)',
      'Y (2019)',
      'Z (2020)]'
    ],
    message: messages.default
  },
  residency: {
    values: ['Lives with Family',
      'Lives independently',
      'Lives on Campus',
      'Displaced',
      'Lives on Campus, displaced during breaks'],
    message: messages.default
  },
  progressToGradAss: {
    values: [
      'Confirmed Graduate',
      'Likely Graduate',
      'Short 12 credits or less to graduation',
      'Stopped Enrolling',
      'Transfered to BA program,unknown if earned AA/AS'
    ],
    message: messages.default
  },
  progressToGradBa: {
    values: [
      'Confirmed Graduate',
      'Likely Graduate',
      'Short 12 credits or less to graduation',
      'Stopped Enrolling'
    ],
    message: messages.default
  },
  tshirtSize: {
    values: [
      'S',
      'M',
      'L',
      'XL',
      'XXL',
      'XXXL'
    ],
    message: messages.default
  },
  sweatshirtSize: {
    values: [
      'S',
      'M',
      'L',
      'XL',
      'XXL',
      'XXXL'
    ],
    message: messages.default
  },
  commonApp: {
    values: [
      'Not started',
      'Not planning to apply via Common App',
      'Started, did not finish',
      'Completed'
    ],
    message: messages.default
  },
  sunyApp: {
    values: [
      'Not started',
      'Not applying to SUNY',
      'Started, did not finish',
      'Completed'
    ],
    message: messages.default
  },
  cunyApp: {
    values: [
      'Not started',
      'Not applying to CUNY',
      'Started, did not finish',
      'Completed'
    ],
    message: messages.default
  },
  housingStatus: {
    values: [
      'Housing form completed and deposit submitted',
      'Housing form not completed',
      'N/A: Student not planning to live on campus'
    ],
    message: messages.default
  },
  physImmunRecords: {
    values: [
      'Sent to School',
      'Not Sent to School',
      'Still needs to get immunizations'
    ],
    message: messages.default
  },

  registeredForClasses: {
    values: [
      'Yes',
      'Not yet registered',
      'N/A'
    ],
    message: messages.default
  },

  postSecondaryPlan: {
    values: [
      'Planning to Enroll in the Fall',
      'Planning to Enroll in Spring',
      'Has not decided',
      'Planning to wait a year and enroll next Fall',
      'Interested in working or Vocational training only',
      'Planning to enlist in military',
      'Not planning to attend college- other'
    ],
    message: messages.default
  }


};

export default {

  tags: function(v) {
    return this.helpers.validateArray(v, this.types.tags);
  },

  transferStatus(v) {
    return this.helpers.validateArray(v, this.types.transferStatus);
  },

  studentSupportOrgName(v) {
    return this.helpers.validateArray(v, this.types.studentSupportOrgName);
  },

  remediationStatus(v) {
    return this.helpers.validateArray(v, this.types.remediationStatus);
  },

  riskFactors(v) {
    return this.helpers.validateArray(v, this.types.riskFactors);
  },

  employmentStatus(v) {
    return this.helpers.validateArray(v, this.types.employmentStatus);
  },

  commsType(v) {
    return this.helpers.validateArray(v, this.types.commsType);
  },

  types: {
    tags: [
      'SPED', 'Free Lunch Eligible', 'ELL'
    ],
    transferStatus: [
      '2 Year to 4 Year',
      '2 Year to 2 Year',
      '4 Year to 4 Year',
      '4 Year to 2 Year',
      'Planning to Transfer',
      'Needs Transfer Support'
    ],
    studentSupportOrgName: [
      'Other',
      'SEEK',
      'CUNY ASAP',
      'CUNY Clip',
      'CUNY Start',
      'HEOP',
      'EOP',
      'Posse',
      'College Discovery',
      'College Crew',
      'Bottom Line',
      'COMPASS',
      'MAP',
      'Emerging Leaders',
      'Passport to Success',
      'Guttman Success Scholar',
      'TYP',
      'TRIO',
      'Apple Corps',
      'Red Hook Initiative Young Adult program',
      'John Jay ACE'
    ],
    remediationStatus: [
      'Needs Math Remediation',
      'Needs Reading Remediation',
      'Needs Writing Remediation',
      'Has Completed All Remediation Requirements',
      'Never Needed Remediation',
      'Attempted Math Remediation (Failed)',
      'Attempted Reading Remediation (Failed)',
      'Attempted Writing Remediation (Failed)'
    ],
    riskFactors: [
      'Academic Probation',
      'Enrolled in Less than 15 Credits',
      'In Danger of Losing Financial Aid',
      'Declining GPA',
      'Mental Health Counseling Needs',
      'Familial Stressors',
      'Displaced',
      'Has a child',
      'Other',
      'Taking time off',
      'Shifting from Full-time to Part-time'
    ],
    employmentStatus: [
      'Working Less than 12 hours',
      'Working 12-25 hours',
      'Working more than 25 hours',
      'Seeking Employment'
    ],
    commsType: [
      'In person',
      'Text',
      'Facebook',
      'Phone call',
      'Email',
      'Other'
    ]
  },

  helpers: {
    validateArray: function(inputArray, optionsArray) {

      if (inputArray.constructor !== Array) {
        return false;
      }

      var output = true;
      inputArray.forEach(function(str) {
        if (!optionsArray.includes(str)) {
          output = false;
          return;
        }
      });

      return output;
    }
  }

};
