const mongoose = require('mongoose');
import mongoosePaginate from 'mongoose-paginate';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
const Schema = mongoose.Schema;
import {College} from './';
import {studentSchema} from '../../common/schemas';
const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const Student = new Schema(studentSchema(Schema));
Student.plugin(mongoosePaginate);

Student.pre('save', true, function(next, done) {
    next();
    const record = this;
    // handle hsGradYear
    if (record.hsGradDate instanceof Date) {
        record.hsGradYear = record.hsGradDate.getFullYear();
    } else {
        delete record.hsGradYear;
    }
    done();
});
Student.pre('save', true, function(next, done) {
    next();
    const record = this;
    // handle mostRecentCol
    if (record.terms < 1) {
        return done();
    }
    record.terms = sortBy(record.terms, (obj) => {
        return obj.enrolBegin;
    }).reverse();
    record.mostRecentCol = record.terms[0].college;
    done();
});
Student.pre('save', true, function(next, done) {
    next();
    const record = this;
    // handle cohort
    if (record.hsGradDate instanceof Date) {
        const currentYear = record.hsGradDate.getFullYear();
        const index = 11 + (currentYear-2010);
        record.cohort = alphabets[index] + ' (' + (currentYear-4) + ')';
    }
    done();
});
Student.pre('save', true, function(next, done) {
    next();
    const record = this;
    // nscRecordFound
    if (record.terms > 0) {
        record.nscRecordFound = true;
    }
    done();
});
Student.pre('save', true, function(next, done) {
    next();
    const record = this;
    // cuny
    if (record.applications > 0) {
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
Student.pre('save', true, function(next, done) {
    next();
    const record = this;
    // suny
    if (record.applications > 0) {
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
