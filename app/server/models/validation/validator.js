
export const messages = {
  default: 'You tried to add `{VALUE}` to `{PATH}` which is forbidden'
};

export const enums = {
  hsAttended: {
    values: ['Baldwin', 'Brooklyn Collaborative', 'Channel View', 'Kurt Hahn', 'Leaders', 'MELS', 'McCown', 'WHEELS'],
    message: messages.default
  },
  gender: {
    values: ['M', 'F'],
    message: messages.default
  },
  ferpa: {
    values: ['Yes', 'No'],
    message: messages.default
  },
  cohort: {
    values: ['P (2010)',
      'Q (2011)',
      'N (2008)',
      'O (2009)',
      'R (2012)',
      'M (2007)',
      'S (2013)',
      'T (2014)',
      'U (2015)',
      'V (2016)',
      'W (2017)',
      'X (2018)',
      'Y (2019)',
      'Z (2020)]'],
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

  types: {
    tags: ['SPED', 'Free Lunch Eligible', 'ELL'],
    transferStatus: ['2 Year to 4 Year',
      '2 Year to 2 Year',
      '4 Year to 4 Year',
      '4 Year to 2 Year',
      'Planning to Transfer',
      'Needs Transfer Support'
    ],
    studentSupportOrgName: ['Other',
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
      'John Jay ACE']

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

