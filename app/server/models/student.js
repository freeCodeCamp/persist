const mongoose = require('mongoose');
import mongoosePaginate from 'mongoose-paginate';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
const Schema = mongoose.Schema;
import {College} from './';
import {studentSchema} from '../../common/schemas';
export const Student = new Schema(studentSchema(Schema));
Student.plugin(mongoosePaginate);

Student.pre('save', true, function (next, done) {
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
Student.pre('save', true, function (next, done) {
    next();
    const record = this;
    // handle mostRecentCol
    if (record.terms.length < 1) {
        return done();
    }
    record.terms = sortBy(record.terms, (obj) => {
        return obj.enrolBegin;
    }).reverse();
    record.mostRecentCol = record.terms[0].college;
    record.mostRecentEnrolStatus = record.terms[0].status;
    done();
});
Student.pre('save', true, function (next, done) {
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
Student.pre('save', true, function (next, done) {
    next();
    const record = this;
    // nscRecordFound
    if (record.terms.length > 0) {
        record.nscRecordFound = true;
    }
    done();
});
Student.pre('save', true, function (next, done) {
    next();
    const record = this;
    // cuny
    if (record.applications.length > 0) {
        const colList = map(record.applications, 'college');
        College.find({
            $and: [
                {_id: {$in: colList}},
                {collType: 1}
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
    }
    done();
});
Student.pre('save', true, function (next, done) {
    next();
    const record = this;
    // suny
    if (record.applications.length > 0) {
        const colList = map(record.applications, 'college');
        College.find({
            $and: [
                {_id: {$in: colList}},
                {collType: 2}
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
    }
    done();
});
export default mongoose.model('Student', Student);
