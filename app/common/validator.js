import transform from 'lodash/transform';
import map from 'lodash/map';
import range from 'lodash/range';
import {studentKeys} from './fieldKeys';
import exportKeys from './exportKeys';
import {mapping, validateArray} from './constants';

export const messages = {
    default: 'You tried to add `{VALUE}` to `{PATH}` which is forbidden'
};

export const types = {
    descriptors: [
        'SPED',
        'Free Lunch Eligible',
        'ELL',
        'Former ELL',
        'IEP',
        'FRL',
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
        'Shifting from Full-time to Part-time',
        'Not insured',
        'Failed a Class'
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
    employmentStatus: [
        'Working Less than 12 hours',
        'Working 12-25 hours',
        'Working more than 25 hours',
        'Seeking Employment'
    ],
    gender: [
        { text: 'Male', value: 'M' },
        { text: 'Female', value: 'F' }
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
    'terms.degreeTitle': [
        'BACHELOR OF BUSINESS ADMINISTRATION',
        'BACHELOR OF MUSIC',
        'BACHELOR OF SCIENCE',
        'BACHELOR OF ARTS',
        'BACHELOR OF TECHNOLOGY',
        'ASSOCIATE IN ARTS',
        'ASSOCIATE IN SCIENCE',
        'MASTER OF BUSINESS ADMINISTRATION',
        'MASTER OF EDUCATION',
        'MASTER OF SOCIAL WORK',
        'CERTIFICATE',
        'Certificate Program',
        'Bachelors Degree',
        'Associates Degree'
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
    durationType: [
        '2 year',
        '4 year',
        'vocational'
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
    'terms.status': transform(mapping.termStatus, (res, val, key) => {
        res.push({ text: val, value: key });
    }, []),
    'caseNotes.communicationType': [
        'In person',
        'Text',
        'Facebook',
        'Phone call',
        'Email',
        'Other'
    ],
    'applications.result': [
        'Accepted',
        'Withdrawn',
        'Unknown',
        'Incomplete',
        'Denied',
        'Cond. Accept',
        'No decision',
        'Waitlisted',
        'Guar. Transfer',
        'Deferred',
        'Jan. Admit'
    ],
    'applications.type': [
        'RD',
        'PRI',
        'ED',
        'EDII',
        'EA',
        'EAII',
        'ROLL',
        'REA',
        'OTHR'
    ],
    'applications.heop': [
        'HEOP',
        'EOP',
        'SEEK',
        'Not Eligible',
        'Other Program'
    ],
    'documents.types': [
        'Award letter',
        'HS Transcript',
        'College Transcript',
        'FAFSA',
        'TAP',
        'Tax Documents',
        'FERPA',
        'Student Aid Report',
        'other'
    ],
    ethnicity: transform(mapping.ethnicity, (res, val, key) => {
        res.push({ text: val, value: key });
    }, []),
    colType: transform(mapping.colType, (res, val, key) => {
        res.push({ text: val, value: key });
    }, []),
    hsGradYear: range((new Date().getFullYear()) - 6, (new Date().getFullYear()) + 4, 1),
    expectedGrad: range((new Date().getFullYear()) - 6, (new Date().getFullYear()) + 4, 1)
};

export const enums = {
    gender: {
        values: map(types.gender, 'value'),
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
    }
};

const validator = {};
const studentFieldTypes = exportKeys(map(studentKeys, 'dbName'), studentKeys);
const arrayTypes = [...studentFieldTypes['checkbox'], ...studentFieldTypes['checkbox_add'], 'terms.degreeTitle'];
for (const field of arrayTypes) {
    validator[field] = (values) => {
        return validateArray(values, types[field]);
    }
}

export default validator;
