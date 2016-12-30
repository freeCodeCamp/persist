import transform from 'lodash/transform';
import map from 'lodash/map';
import {mapping} from './constants';

export const messages = {
    default: 'You tried to add `{VALUE}` to `{PATH}` which is forbidden'
};

export const types = {
    tags: [
        'SPED', 'Free Lunch Eligible', 'ELL', 'IEP', 'FRL'
    ],
    transferStatus: [
        '2 Year to 4 Year',
        '2 Year to 2 Year',
        '4 Year to 4 Year',
        '4 Year to 2 Year',
        'Planning to Transfer',
        'Needs Transfer Support',
        'Multiple transfers'
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
    ],
    hsAttended: [
        'Baldwin',
        'Brooklyn Collaborative',
        'Channel View',
        'Kurt Hahn',
        'Leaders',
        'MELS',
        'McCown',
        'WHEELS'
    ],
    gender: [
        {text: 'Male', value: 'M'},
        {text: 'Female', value: 'F'}
    ],
    ferpa: [
        'Yes', 'No'
    ],
    cohort: [
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
        'Z (2020)'
    ],
    residency: [
        'Lives with Family',
        'Lives independently',
        'Lives on Campus',
        'Displaced',
        'Lives on Campus, displaced during breaks'
    ],
    progressToGradAss: [
        'Confirmed Graduate',
        'Confirmed Graduated',
        'Likely Graduate',
        'Short 12 credits or less to graduation',
        'Stopped Enrolling',
        'Transfered to BA program,unknown if earned AA/AS',
        'Unclear if Graduated or Dropped Out',
        'Dropped Out'
    ],
    progressToGradBa: [
        'Confirmed Graduate',
        'Likely Graduate',
        'Short 12 credits or less to graduation',
        'Stopped Enrolling',
        'Unclear if Graduated or Dropped Out',
        'Dropped Out'
    ],
    tshirtSize: [
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        'XXXL'
    ],
    sweatshirtSize: [
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        'XXXL'
    ],
    commonApp: [
        'Not started',
        'Not planning to apply via Common App',
        'Started, did not finish',
        'Completed'
    ],
    sunyApp: [
        'Not started',
        'Not applying to SUNY',
        'Started, did not finish',
        'Completed'
    ],
    cunyApp: [
        'Not started',
        'Not applying to CUNY',
        'Started, did not finish',
        'Completed'
    ],
    housingStatus: [
        'Housing form completed and deposit submitted',
        'Housing form not completed',
        'N/A: Student not planning to live on campus'
    ],
    physImmunRecords: [
        'Sent to School',
        'Not Sent to School',
        'Still needs to get immunizations'
    ],
    registeredForClasses: [
        'Yes',
        'Not yet registered',
        'N/A'
    ],
    postSecPlan: [
        'Planning to Enroll in the Fall',
        'Planning to Enroll in Spring',
        'Has not decided',
        'Planning to wait a year and enroll next Fall',
        'Interested in working or Vocational training only',
        'Planning to enlist in military',
        'Not planning to attend college- other'
    ],
    'graduations.type': [
        'Associates Degree',
        'Bachelors Degree',
        'Certificate'
    ],
    hs: [
        'Hahn',
        'Baldwin',
        'Channel View',
        'McCown',
        'WHEELS',
        'Leaders',
        'BCS',
        'MELS'
    ],
    'terms.status': [
        'F',
        'H',
        'L',
        'Q',
        'A',
        'W',
        'D'
    ],
    'documents.types': [
        'other'
    ],
    ethnicity: transform(mapping.ethnicity, (res, val, key) => {
        res.push({text: val, value: key});
    }, []),
    expectedGrad: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
};

export const enums = {
    hsAttended: {
        values: types.hsAttended,
        message: messages.default
    },
    gender: {
        values: map(types.gender, 'value'),
        message: messages.default
    },
    ferpa: {
        values: types.ferpa,
        message: messages.default
    },
    cohort: {
        values: types.cohort,
        message: messages.default
    },
    residency: {
        values: types.residency,
        message: messages.default
    },
    progressToGradAss: {
        values: types.progressToGradAss,
        message: messages.default
    },
    progressToGradBa: {
        values: types.progressToGradBa,
        message: messages.default
    },
    tshirtSize: {
        values: types.tshirtSize,
        message: messages.default
    },
    sweatshirtSize: {
        values: types.sweatshirtSize,
        message: messages.default
    },
    commonApp: {
        values: types.commonApp,
        message: messages.default
    },
    sunyApp: {
        values: types.sunyApp,
        message: messages.default
    },
    cunyApp: {
        values: types.cunyApp,
        message: messages.default
    },
    housingStatus: {
        values: types.housingStatus,
        message: messages.default
    },
    physImmunRecords: {
        values: types.physImmunRecords,
        message: messages.default
    },
    registeredForClasses: {
        values: types.registeredForClasses,
        message: messages.default
    },
    postSecPlan: {
        values: types.postSecPlan,
        message: messages.default
    },
    hs: {
        values: types.hs,
        message: messages.default
    }
};

export default {

    tags(v) {
        return this.helpers.validateArray(v, types.tags);
    },

    transferStatus(v) {
        return this.helpers.validateArray(v, types.transferStatus);
    },

    studentSupportOrgName(v) {
        return this.helpers.validateArray(v, types.studentSupportOrgName);
    },

    remediationStatus(v) {
        return this.helpers.validateArray(v, types.remediationStatus);
    },

    riskFactors(v) {
        return this.helpers.validateArray(v, types.riskFactors);
    },

    employmentStatus(v) {
        return this.helpers.validateArray(v, types.employmentStatus);
    },

    commsType(v) {
        return this.helpers.validateArray(v, types.commsType);
    },

    helpers: {
        validateArray(inputArray, optionsArray) {
            // takes an array of values, and an array of possible values, and makes sure they exist

            if (inputArray.constructor !== Array) {
                return false;
            }

            var output = true;
            inputArray.forEach(function (str) {
                if (!optionsArray.includes(str)) {
                    output = false;
                    return;
                }
            });

            return output;
        }
    }

};
