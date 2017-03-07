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
        var data = [];
        var row;
        transformer.on('readable', function () {
            while (row = transformer.read()) {
                data.push(row);
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
                    if (!oldStudent) {
                        var newStudent = new _student2.default(record);
                        newStudent.save(function (err) {
                            if (err) {
                                console.log('we got a validation error', err);
                                return callback(err);
                            }
                            return callback(null);
                        });
                    } else {
                        var studentObject = oldStudent.toObject();
                        var _newStudent = (0, _merge2.default)(studentObject, record);
                        (0, _forOwn2.default)(studentObject, function (value, key) {
                            oldStudent[key] = _newStudent[key];
                        });
                        oldStudent.save(function (err) {
                            if (err) {
                                console.log('we got a validation error', err);
                                return callback(err);
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

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _forOwn = require('lodash/forOwn');

var _forOwn2 = _interopRequireDefault(_forOwn);

var _streamTransform = require('stream-transform');

var _streamTransform2 = _interopRequireDefault(_streamTransform);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _student = require('../models/student');

var _student2 = _interopRequireDefault(_student);

var _fieldKeys = require('../../common/fieldKeys');

var _student_record_transformer = require('./student_record_transformer');

var _student_record_transformer2 = _interopRequireDefault(_student_record_transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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