'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (fileName) {
    return new Promise(function (resolve, reject) {
        var parser = (0, _csvParse2.default)({
            delimiter: ',',
            columns: mapValues,
            auto_parse: true
        });

        var transformer = (0, _streamTransform2.default)(_student_record_transformer2.default, {
            parallel: 20
        });
        var data = {};
        var row = void 0;
        transformer.on('readable', function () {
            while (row = transformer.read()) {
                data[row.osis] = data[row.osis] || (0, _clone2.default)({});
                data[row.osis] = (0, _merge2.default)(data[row.osis], row);
            }
        });

        var error = void 0;

        transformer.on('error', function (err) {
            error = err;
            console.log(err.message);
        });

        transformer.on('end', function () {
            if (error) return reject(error);
            // reduce data size for testing
            // data = data.splice(0, 1);
            var addedCount = 0;
            var modifiedCount = 0;
            var newStudents = [];
            var updatedStudents = [];
            var errorStudents = [];
            var errorCount = 0;
            console.time('dbSave');

            _async2.default.eachLimit(data, 10, function (record, callback) {
                _student2.default.findOne({ osis: record.osis }, function (err, oldStudent) {
                    if (err) {
                        console.log('error in finding document', err);
                        return callback(err);
                    }
                    if (!oldStudent && !record.alias) {
                        (0, _helpers.setUndefined)(record);
                        var newStudent = new _student2.default(record);
                        newStudent.save(function (err) {
                            if (err) {
                                if (err.code === 11000) {
                                    return callback(null);
                                }
                                console.log('we got a validation error', err);
                                return callback(null);
                            }
                            return callback(null);
                        });
                    } else {
                        if (record.alias) {
                            var oldAlias = oldStudent.aliases.find(function (alias) {
                                return (0, _isEqual2.default)(alias, createAlias(record));
                            });
                            if (!oldAlias) {
                                oldStudent.aliases.push(createAlias(record));
                            }
                        } else {
                            var newRecord = {};
                            (0, _forOwn2.default)(record, function (value, key) {
                                (0, _set2.default)(newRecord, key, value);
                            });
                            var studentObject = oldStudent.toObject();
                            var _newStudent = (0, _merge2.default)(studentObject, newRecord);
                            (0, _forOwn2.default)(studentObject, function (value, key) {
                                if (key !== '_id') {
                                    if (_newStudent[key] === 'set undefined') {
                                        oldStudent[key] = undefined;
                                    } else if (_newStudent[key]) {
                                        oldStudent[key] = _newStudent[key];
                                    }
                                }
                            });
                        }
                        oldStudent.save(function (err) {
                            if (err) {
                                if (err.code === 11000) {
                                    return callback(null);
                                }
                                console.log('we got a validation error', err);
                                return callback(null);
                            }
                            return callback(null);
                        });
                    }
                });
            }, function (err) {
                console.log('getting through to here'.blue);
                if (err) {
                    reject(err);
                    return;
                }
                console.timeEnd('dbSave');
                resolve({
                    modifiedCount: modifiedCount,
                    addedCount: addedCount,
                    newStudents: newStudents,
                    updatedStudents: updatedStudents,
                    errorStudents: errorStudents,
                    errorCount: errorCount
                });
            });
        });

        _fs2.default.createReadStream(fileName).pipe(parser).pipe(transformer);
    });
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _set = require('lodash/set');

var _set2 = _interopRequireDefault(_set);

var _forOwn = require('lodash/forOwn');

var _forOwn2 = _interopRequireDefault(_forOwn);

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _streamTransform = require('stream-transform');

var _streamTransform2 = _interopRequireDefault(_streamTransform);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _helpers = require('../helpers');

var _student = require('../models/student');

var _student2 = _interopRequireDefault(_student);

var _fieldKeys = require('../../common/fieldKeys');

var _student_record_transformer = require('./student_record_transformer');

var _student_record_transformer2 = _interopRequireDefault(_student_record_transformer);

var _merge = require('../helpers/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createAlias = function createAlias(student) {
    return {
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        suffix: student.suffix
    };
};

// this is the data we need for validation and transforming


function mapValues(line) {
    return line.map(function (key) {
        var obj = _fieldKeys.studentKeys.find(function (field) {
            return field.fieldName === key;
        });
        if (obj) {
            return obj.dbName;
        }
        return key;
    });
}