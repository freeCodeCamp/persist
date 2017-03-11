const mongoose = require('mongoose');
import mongoosePaginate from "mongoose-paginate";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";
import map from "lodash/map";
import cloneDeep from "lodash/cloneDeep";
import {College} from "./";
import {studentSchema} from "../../common/schemas";
const Schema = mongoose.Schema;
export const Student = new Schema(studentSchema(Schema));
Student.plugin(mongoosePaginate);

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
    record.terms = sortBy(record.terms, (obj) => {
        return obj.enrolBegin;
    }).reverse();
    const recordTerms = cloneDeep(record.terms).reverse();
    record.mostRecentCol = record.terms[0].college;
    record.mostRecentEnrolStatus = record.terms[0].status;
    record.firstCol = recordTerms[0].college;
    const colleges = uniq(map(recordTerms, 'college'));
    if (colleges.length > 1) {
        College.find({ _id: { $in: [colleges] } }, 'durationType',
            (err, durationTypes) => {
                if (err || durationTypes.length < 2) {
                    return done();
                }
                if (durationTypes[0].toString() === '2 year') {
                    if (durationTypes[1].toString() === '2 year') {
                        record.transferStatus.push('2 Year to 2 Year');
                    } else if (durationTypes[1].toString() === '4 year') {
                        record.transferStatus.push('2 Year to 4 Year');
                    }
                } else if (durationTypes[0].toString() === '4 year') {
                    if (durationTypes[1].toString() === '2 year') {
                        record.transferStatus.push('4 Year to 2 Year');
                    } else if (durationTypes[1].toString() === '4 year') {
                        record.transferStatus.push('4 Year to 4 Year');
                    }
                }
                return done();
            });
    } else {
        done();
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
        College.find({
            $and: [
                { _id: { $in: colList } },
                { collType: 1 }
            ]
        }, (err, cunyColleges) => {
            if (err) {
                return done(err);
            }
            if (cunyColleges.length > 0) {
                record.cunyApp = 'Completed';
            }
            return done();
        })
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
        College.find({
            $and: [
                { _id: { $in: colList } },
                { collType: 2 }
            ]
        }, (err, sunyColleges) => {
            if (err) {
                return done(err);
            }
            if (sunyColleges.length > 0) {
                record.sunyApp = 'Completed';
            }
            return done();
        });
    } else {
        done();
    }
});
export default mongoose.model('Student', Student);
