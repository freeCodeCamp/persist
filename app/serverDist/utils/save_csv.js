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
                data[row.osis] = data[row.osis] || (0, _lodash.clone)({});
                data[row.osis] = (0, _merge2.default)(data[row.osis], row);
            }
        });

        var error = [];

        transformer.on('error', function (err) {
            error.push(err);
            console.log(err.message);
        });

        transformer.on('end', function () {
            if (error.length > 0) return reject((0, _lodash.uniqWith)(error, _lodash.isEqual));
            // reduce data size for testing
            // data = data.splice(0, 1);
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
                                return callback(err);
                            }
                            return callback(null);
                        });
                    } else {
                        if (record.alias) {
                            var oldAlias = oldStudent.aliases.find(function (alias) {
                                return (0, _lodash.isEqual)(alias, createAlias(record));
                            });
                            if (!oldAlias) {
                                oldStudent.aliases.push(createAlias(record));
                            }
                        } else {
                            var newRecord = {};
                            (0, _lodash.forOwn)(record, function (value, key) {
                                (0, _lodash.set)(newRecord, key, value);
                            });
                            var studentObject = oldStudent.toObject();
                            var _newStudent = (0, _merge2.default)(studentObject, newRecord);
                            (0, _lodash.forOwn)(studentObject, function (value, key) {
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
                                return callback(err);
                            }
                            return callback(null);
                        });
                    }
                });
            }, function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                console.timeEnd('dbSave');
                resolve(true);
            });
        });

        _fs2.default.createReadStream(fileName).pipe(parser).pipe(transformer);
    });
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _lodash = require('lodash');

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