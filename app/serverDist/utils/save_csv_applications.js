'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _streamTransform = require('stream-transform');

var _streamTransform2 = _interopRequireDefault(_streamTransform);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _lodash = require('lodash');

var _helpers = require('../helpers');

var _student = require('../models/student');

var _student2 = _interopRequireDefault(_student);

var _fieldKeys = require('../../common/fieldKeys');

var _application_record_transformer = require('./application_record_transformer');

var _application_record_transformer2 = _interopRequireDefault(_application_record_transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapValues = function mapValues(line) {
    return line.map(function (key) {
        var obj = _fieldKeys.applicationKeys.find(function (field) {
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

        var transformer = (0, _streamTransform2.default)(_application_record_transformer2.default, {
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
            _async2.default.eachLimit(data, 10, function (applications, callback) {
                if (!applications || applications.length < 1) {
                    callback(null);
                    return;
                }
                var osis = applications[0].osis;
                // find student record
                // if exists - only then proceed
                _student2.default.findOne({
                    osis: osis
                }, function (err, student) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    if (student) {
                        var studentApplications = student.applications;
                        applications.forEach(function (applicationRecord) {
                            var application = studentApplications.find(function (elem) {
                                return (0, _lodash.toString)(elem.college) === (0, _lodash.toString)(applicationRecord.college);
                            });
                            if (application) {
                                (0, _lodash.merge)(application, applicationRecord);
                                (0, _helpers.setUndefined)(application);
                            } else {
                                (0, _helpers.setUndefined)(applicationRecord);
                                studentApplications.push(applicationRecord);
                            }
                        });
                        studentApplications = studentApplications.filter(function (obj) {
                            return !(0, _lodash.isEmpty)(obj);
                        });
                        studentApplications = (0, _lodash.sortBy)(studentApplications, function (obj) {
                            return obj.enrolBegin;
                        }).reverse();
                        student.applications = studentApplications;
                        student.save(function (err, updatedStudent) {
                            if (err) {
                                console.log('error', studentApplications, student);
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
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });

        _fs2.default.createReadStream(fileName).pipe(parser).pipe(transformer);
    });
};