'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _streamTransform = require('stream-transform');

var _streamTransform2 = _interopRequireDefault(_streamTransform);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('../helpers');

var _student = require('../models/student');

var _student2 = _interopRequireDefault(_student);

var _fieldKeys = require('../../common/fieldKeys');

var _term_record_transformer = require('./term_record_transformer');

var _term_record_transformer2 = _interopRequireDefault(_term_record_transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapValues = function mapValues(line) {
    return line.map(function (key) {
        var obj = _fieldKeys.termKeys.find(function (field) {
            return field.fieldName === key;
        });
        if (obj) {
            return obj.dbName;
        }
        return null;
    });
};

exports.default = function (fileName) {
    return new Promise(function (resolve, reject) {
        var parser = (0, _csvParse2.default)({
            delimiter: ',',
            columns: mapValues,
            auto_parse: true
        });

        var transformer = (0, _streamTransform2.default)(_term_record_transformer2.default, {
            parallel: 20
        });
        var data = {};
        var row = void 0;
        transformer.on('readable', function () {
            while (row = transformer.read()) {
                data[row.osis] = data[row.osis] || (0, _lodash.clone)([]);
                data[row.osis].push(row);
            }
        });
        var error = [];

        transformer.on('error', function (err) {
            error.push(err);
            console.log(err.message);
        });

        transformer.on('end', function () {
            if (error.length > 0) return reject((0, _lodash.uniqWith)(error, _lodash.isEqual));
            _async2.default.eachLimit(data, 10, function (terms, callback) {
                if (!terms || terms.length < 1) {
                    callback(null);
                    return;
                }
                var osis = terms[0].osis;
                // find student record
                // if exists - only then proceed
                _student2.default.findOne({
                    osis: osis
                }, function (err, student) {
                    if (err) {
                        return callback(err);
                    }
                    if (student) {
                        var studentTerms = student.terms;
                        terms.forEach(function (termRecord) {
                            var term = studentTerms.find(function (elem) {
                                var overlap = elem.enrolBegin >= termRecord.enrolBegin && elem.enrolBegin <= termRecord.enrolBegin || elem.enrolEnd >= termRecord.enrolBegin && elem.enrolEnd <= termRecord.enrolEnd;
                                if (overlap) {
                                    var overlapStart = void 0,
                                        overlapEnd = void 0;
                                    if ((0, _moment2.default)(elem.enrolBegin).diff((0, _moment2.default)(termRecord.enrolBegin), 'days') >= 0) {
                                        overlapStart = elem.enrolBegin;
                                    } else if ((0, _moment2.default)(elem.enrolEnd).diff((0, _moment2.default)(termRecord.enrolBegin), 'days') >= 0) {
                                        overlapStart = termRecord.enrolBegin;
                                    }
                                    overlapEnd = (0, _moment2.default)(termRecord.enrolEnd).diff((0, _moment2.default)(elem.enrolEnd), 'days') >= 0 ? elem.enrolEnd : termRecord.enrolEnd;
                                    if (overlapStart && overlapEnd) {
                                        var overlappingDays = (0, _moment2.default)(overlapEnd).diff((0, _moment2.default)(overlapStart), 'days');
                                        var elemDays = (0, _moment2.default)(elem.enrolEnd).diff((0, _moment2.default)(elem.enrolBegin), 'days');
                                        var termRecordDays = (0, _moment2.default)(termRecord.enrolEnd).diff((0, _moment2.default)(termRecord.enrolBegin), 'days');
                                        if (overlappingDays / elemDays >= 0.85 && overlappingDays / termRecordDays >= 0.85) {
                                            return true;
                                        }
                                    }
                                }
                                return false;
                            });
                            if (term) {
                                (0, _lodash.merge)(term, termRecord);
                                (0, _helpers.setUndefined)(term);
                            } else {
                                (0, _helpers.setUndefined)(termRecord);
                                studentTerms.push(termRecord);
                            }
                        });
                        studentTerms = studentTerms.filter(function (obj) {
                            return !(0, _lodash.isEmpty)(obj);
                        });
                        student.terms = studentTerms;
                        // for now, lets just overwrite the doc
                        student.save(function (err, updatedStudent) {
                            if (err) {
                                console.log('error', err, studentTerms, student);
                                callback(err);
                            } else {
                                callback(null);
                            }
                        });
                    } else {
                        return callback(null);
                    }
                });
            }, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(true);
            });
        });

        _fs2.default.createReadStream(fileName).pipe(parser).pipe(transformer);
    });
};