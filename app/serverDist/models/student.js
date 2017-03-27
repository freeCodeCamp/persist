'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Student = undefined;

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _mongoosePaginate = require('mongoose-paginate');

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

var _sortBy = require('lodash/sortBy');

var _sortBy2 = _interopRequireDefault(_sortBy);

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _ = require('./');

var _schemas = require('../../common/schemas');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Student = exports.Student = new Schema((0, _schemas.studentSchema)(Schema));
Student.plugin(_mongoosePaginate2.default);

var setGraduationType = function setGraduationType(record, done) {
    _async2.default.each(record.terms, function (term, callback) {
        if (term.status === 'Graduated' && (!term.graduationType || term.graduationType.length < 1)) {
            return _.College.findOne({ _id: term.college }, function (err, college) {
                if (err) {
                    console.log(err);
                } else if (college) {
                    term.graduationType = college.durationType;
                }
                callback(null);
            });
        }
        callback(null);
    }, function (err) {
        done();
    });
};

var setTermNames = function setTermNames(record) {
    record.terms.forEach(function (term) {
        var enrolBegin = term.enrolBegin;
        var enrolEnd = term.enrolEnd;
        var year = new Date(enrolBegin).getFullYear();
        if (enrolBegin && enrolEnd && (!term.name || term.name.length < 1)) {
            if ((0, _moment2.default)(enrolBegin).diff((0, _moment2.default)([year, 7, 10]), 'days') > 0 && (0, _moment2.default)([year, 11, 31]).diff((0, _moment2.default)(enrolEnd), 'days') > 0) {
                term.name = 'Fall ' + year;
            } else if ((0, _moment2.default)(enrolBegin).diff((0, _moment2.default)([year, 11, 1]), 'days') > 0 && (0, _moment2.default)([year + 1, 2, 1]).diff((0, _moment2.default)(enrolEnd), 'days') > 0) {
                term.name = 'Winter ' + year;
            } else if ((0, _moment2.default)(enrolBegin).diff((0, _moment2.default)([year, 0, 1]), 'days') > 0 && (0, _moment2.default)(enrolEnd).diff((0, _moment2.default)([year, 3, 1]), 'days') > 0 && (0, _moment2.default)([year, 5, 30]).diff((0, _moment2.default)(enrolEnd), 'days') > 0) {
                term.name = 'Spring ' + year;
            } else if ((0, _moment2.default)(enrolBegin).diff((0, _moment2.default)([year, 4, 1]), 'days') > 0 && (0, _moment2.default)([year, 7, 30]).diff((0, _moment2.default)(enrolEnd), 'days') > 0) {
                term.name = 'Summer ' + year;
            }
        }
    });
};

Student.pre('save', true, function (next, done) {
    next();
    var record = this;
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
    var record = this;
    // handle mostRecentCol
    if (record.terms.length < 1) {
        return done();
    }
    record.terms = (0, _sortBy2.default)(record.terms, function (obj) {
        return obj.enrolBegin;
    }).reverse();
    setTermNames(record);
    var recordTerms = (0, _cloneDeep2.default)(record.terms).reverse();
    record.mostRecentCol = record.terms[0].college;
    record.mostRecentEnrolStatus = record.terms[0].status;
    record.firstCol = recordTerms[0].college;
    var colleges = (0, _uniq2.default)((0, _map2.default)(recordTerms, function (term) {
        return term.college;
    }));
    if (colleges.length > 1) {
        _.College.find({ _id: { $in: colleges } }, 'durationType -_id', function (err, durationTypes) {
            durationTypes = (0, _map2.default)(durationTypes, 'durationType');
            if (err || durationTypes.length < 2) {
                return setGraduationType(record, done);
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
            return setGraduationType(record, done);
        });
    } else {
        return setGraduationType(record, done);
    }
});
Student.pre('save', true, function (next, done) {
    next();
    var record = this;
    // handle expectedHSGrad
    if (record.cohort && record.cohort.length > 0) {
        var myRegexp = /.*\s\((\d{4})\)/g;
        var match = myRegexp.exec(record.cohort);
        if (match && match[1]) {
            var year = Number(match[1]);
            record.expectedHSGrad = new Date('9/15/' + (year + 4));
        }
    }
    done();
});
Student.pre('save', true, function (next, done) {
    next();
    var record = this;
    // nscRecordFound
    record.nscRecordFound = record.terms.length > 0;
    record.alias = record.aliases.length > 0;
    done();
});
Student.pre('save', true, function (next, done) {
    next();
    var record = this;
    // cuny
    if (record.applications.length > 0) {
        var colList = (0, _map2.default)(record.applications, 'college');
        _.College.find({
            $and: [{ _id: { $in: colList } }, { collType: 1 }]
        }, function (err, cunyColleges) {
            if (err) {
                return done(err);
            }
            if (cunyColleges.length > 0) {
                record.cunyApp = 'Completed';
            }
            return done();
        });
    } else {
        done();
    }
});
Student.pre('save', true, function (next, done) {
    next();
    var record = this;
    // suny
    if (record.applications.length > 0) {
        var colList = (0, _map2.default)(record.applications, 'college');
        _.College.find({
            $and: [{ _id: { $in: colList } }, { collType: 2 }]
        }, function (err, sunyColleges) {
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
exports.default = mongoose.model('Student', Student);