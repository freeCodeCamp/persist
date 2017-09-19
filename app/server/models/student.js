const mongoose = require('mongoose');
import async from 'async';
import moment from 'moment';
import mongoosePaginate from 'mongoose-paginate';
import { sortBy, uniq, map, cloneDeep } from 'lodash';
import { College } from './';
import { studentSchema } from '../../common/schemas';
const Schema = mongoose.Schema;
export const Student = new Schema(studentSchema(Schema));
Student.plugin(mongoosePaginate);

const setGraduationType = (record, done) => {
    async.each(
        record.terms,
        (term, callback) => {
            if (term.status === 'Graduated' && (!term.graduationType || term.graduationType.length < 1)) {
                return College.findOne({ _id: term.college }, (err, college) => {
                    if (err) {
                        console.log(err);
                    } else if (college && !term.graduationType) {
                        term.graduationType = college.durationType;
                    }
                    callback(null);
                });
            }
            callback(null);
        },
        err => {
            done();
        }
    );
};

const setTermNames = record => {
    record.terms.forEach(term => {
        const enrolBegin = term.enrolBegin;
        const enrolEnd = term.enrolEnd;
        const year = new Date(enrolBegin).getFullYear();
        if (enrolBegin && enrolEnd && (!term.name || term.name.length < 1)) {
            if (moment(enrolBegin).diff(moment([year, 7, 10]), 'days') > 0 && moment([year, 11, 31]).diff(moment(enrolEnd), 'days') > 0) {
                term.name = 'Fall ' + year;
            } else if (
                moment(enrolBegin).diff(moment([year, 11, 1]), 'days') > 0 &&
                moment([year + 1, 2, 1]).diff(moment(enrolEnd), 'days') > 0
            ) {
                term.name = 'Winter ' + year;
            } else if (
                moment(enrolBegin).diff(moment([year, 0, 1]), 'days') > 0 &&
                moment(enrolEnd).diff(moment([year, 3, 1]), 'days') > 0 &&
                moment([year, 5, 30]).diff(moment(enrolEnd), 'days') > 0
            ) {
                term.name = 'Spring ' + year;
            } else if (
                moment(enrolBegin).diff(moment([year, 4, 1]), 'days') > 0 &&
                moment([year, 7, 30]).diff(moment(enrolEnd), 'days') > 0
            ) {
                term.name = 'Summer ' + year;
            }
        }
    });
};

Student.pre('save', true, function(next, done) {
    next();
    const record = this;
    // handle hsGradYear
    if (record.hsGradDate instanceof Date) {
        record.hsGradYear = record.hsGradDate.getFullYear();
    } else {
        record.hsGradYear = undefined;
    }
    done();
});

Student.pre('save', true, function(next, done) {
    next();
    const record = this;
    // handle mostRecentCol
    if (record.terms.length < 1) {
        return done();
    }
    record.terms = sortBy(record.terms, obj => {
        return obj.enrolBegin;
    })
        .reverse()
        .filter(term => term.enrolBegin || term.enrolEnd);
    setTermNames(record);
    const recordTerms = cloneDeep(record.terms).reverse();
    record.mostRecentCol = record.terms[0].college;
    record.mostRecentEnrolStatus = record.terms[0].status;
    record.firstCol = recordTerms[0].college;
    const colleges = uniq(map(recordTerms, term => term.college.toString()));
    if (colleges.length > 1) {
        College.find({ _id: { $in: colleges } }, 'durationType -_id', (err, durationTypes) => {
            durationTypes = map(durationTypes, 'durationType');
            if (err || durationTypes.length < 2) {
                return setGraduationType(record, done);
            }
            if (durationTypes[0] === '2 year') {
                if (durationTypes[1] === '2 year') {
                    record.transferStatus.push('2 Year to 2 Year');
                } else if (durationTypes[1] === '4 year') {
                    record.transferStatus.push('2 Year to 4 Year');
                }
            } else if (durationTypes[0] === '4 year') {
                if (durationTypes[1] === '2 year') {
                    record.transferStatus.push('4 Year to 2 Year');
                } else if (durationTypes[1] === '4 year') {
                    record.transferStatus.push('4 Year to 4 Year');
                }
            }
            record.transferStatus = uniq(record.transferStatus);
            return setGraduationType(record, done);
        });
    } else {
        return setGraduationType(record, done);
    }
});

Student.pre('save', true, function(next, done) {
    next();
    const record = this;
    // handle expectedHSGrad
    if (record.cohort && record.cohort.length > 0) {
        const myRegexp = /.*\s\((\d{4})\)/g;
        const match = myRegexp.exec(record.cohort);
        if (match && match[1]) {
            const year = Number(match[1]);
            record.expectedHSGrad = new Date(`9/15/${year + 4}`);
        }
    }
    done();
});
Student.pre('save', true, function(next, done) {
    next();
    const record = this;
    // nscRecordFound
    record.nscRecordFound = record.terms.length > 0;
    record.alias = record.aliases.length > 0;
    done();
});
Student.pre('save', true, function(next, done) {
    next();
    const record = this;
    // cuny
    if (record.applications.length > 0) {
        const colList = map(record.applications, 'college');
        College.find(
            {
                $and: [{ _id: { $in: colList } }, { collType: 1 }]
            },
            (err, cunyColleges) => {
                if (err) {
                    return done(err);
                }
                if (cunyColleges.length > 0) {
                    record.cunyApp = 'Completed';
                }
                return done();
            }
        );
    } else {
        done();
    }
});
Student.pre('save', true, function(next, done) {
    next();
    const record = this;
    // suny
    if (record.applications.length > 0) {
        const colList = map(record.applications, 'college');
        College.find(
            {
                $and: [{ _id: { $in: colList } }, { collType: 2 }]
            },
            (err, sunyColleges) => {
                if (err) {
                    return done(err);
                }
                if (sunyColleges.length > 0) {
                    record.sunyApp = 'Completed';
                }
                return done();
            }
        );
    } else {
        done();
    }
});
export default mongoose.model('Student', Student);
