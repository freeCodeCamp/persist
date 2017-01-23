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

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

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
                data[row.osis] = data[row.osis] || [];
                data[row.osis].push(row);
            }
        });
        var error = void 0;
        transformer.on('error', function (err) {
            error = err;
            console.log(err.message, 'error');
        });

        transformer.on('end', function () {
            if (error) return reject(error);
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
                        (function () {
                            var studentApplications = student.applications;
                            applications.forEach(function (applicationRecord) {
                                var application = studentApplications.find(function (elem) {
                                    return elem.college.toString() === applicationRecord.college.toString();
                                });
                                if (application) {
                                    _lodash2.default.merge(application, applicationRecord);
                                } else {
                                    studentApplications.push(applicationRecord);
                                }
                            });
                            studentApplications = studentApplications.filter(function (obj) {
                                return !_lodash2.default.isEmpty(obj);
                            });
                            studentApplications = _lodash2.default.sortBy(studentApplications, function (obj) {
                                return obj.enrolBegin;
                            }).reverse();
                            student.applications = studentApplications;
                            // for now, lets just overwrite the doc
                            student.save(function (err, updatedStudent) {
                                if (err) {
                                    console.log('error', studentApplications, student);
                                    callback(err);
                                } else {
                                    callback(null);
                                }
                            });
                        })();
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