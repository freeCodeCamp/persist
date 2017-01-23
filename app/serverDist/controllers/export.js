'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.exportStudentCSV = undefined;

var _parallel = require('async/parallel');

var _parallel2 = _interopRequireDefault(_parallel);

var _mapLimit = require('async/mapLimit');

var _mapLimit2 = _interopRequireDefault(_mapLimit);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _json2csv = require('json2csv');

var _json2csv2 = _interopRequireDefault(_json2csv);

var _models = require('../models');

var _fieldKeys = require('../../common/fieldKeys');

var _exportKeys = require('../../common/exportKeys');

var _exportKeys2 = _interopRequireDefault(_exportKeys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var studentKeysObj = _lodash2.default.keyBy(_fieldKeys.studentKeys, 'dbName');
var applicationKeysObj = _lodash2.default.keyBy(_fieldKeys.applicationKeys, 'dbName');
var collegeGraduationKeysObj = _lodash2.default.keyBy(_fieldKeys.collegeGraduationKeys, 'dbName');
var collegeKeysObj = _lodash2.default.keyBy(_fieldKeys.collegeKeys, 'dbName');
var termKeysObj = _lodash2.default.keyBy(_fieldKeys.termKeys, 'dbName');

var createModelObj = function createModelObj() {
    var collegeObj = void 0,
        schoolObj = void 0;
    return new Promise(function (resolve, reject) {
        (0, _parallel2.default)([function (callback) {
            _models.College.find({}, function (err, colleges) {
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                collegeObj = _lodash2.default.keyBy(colleges, '_id');
                return callback(null);
            });
        }, function (callback) {
            _models.School.find({}, function (err, schools) {
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                schoolObj = _lodash2.default.keyBy(schools, '_id');
                return callback(null);
            });
        }], function (err) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            resolve([collegeObj, schoolObj]);
        });
    });
};

var exportStudentCSV = exports.exportStudentCSV = function exportStudentCSV(req, res) {
    var _req$body = req.body,
        fields = _req$body.fields,
        students = _req$body.students;

    var fieldTypes = (0, _exportKeys2.default)(fields);
    var fieldNames = fields.map(function (field) {
        if (studentKeysObj[field]) {
            return studentKeysObj[field].fieldName;
        }
        return 'Field not available';
    });
    var quotes = '';
    var doubleQuotes = '"';
    createModelObj().then(function (modelObj) {
        var collegeObj = modelObj[0];
        var schoolObj = modelObj[1];
        (0, _mapLimit2.default)(students, 100, function (student, callback) {
            fieldTypes['college'].forEach(function (field) {
                var studentField = student[field];
                if (studentField && collegeObj[studentField]) {
                    student[field] = collegeObj[studentField].fullName;
                }
            });
            fieldTypes['school'].forEach(function (field) {
                var studentField = student[field];
                if (studentField && schoolObj[studentField]) {
                    student[field] = schoolObj[studentField].name;
                }
            });
            fieldTypes['checkbox'].forEach(function (field) {
                var studentField = student[field];
                student[field] = '"' + studentField.join(',') + '"';
            });
            fieldTypes['datepicker'].forEach(function (field) {
                var studentField = student[field];
                var dateString = (0, _moment2.default)(studentField).format('l');
                if (dateString !== 'Invalid Date') {
                    student[field] = dateString;
                }
            });
            process.nextTick(function () {
                callback(null, student);
            });
        }, function (err, finalData) {
            if (err) {
                console.log(err);
                return res.status(500).send(err || 'error in finding students');
            }
            var csv = (0, _json2csv2.default)({
                data: finalData,
                fields: fields,
                fieldNames: fieldNames,
                quotes: quotes,
                doubleQuotes: doubleQuotes
            }, function (err, csvFile) {
                if (err) {
                    console.log(err);
                    return res.status(500).send(err || 'server error');
                }
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader("Content-Disposition", 'attachment; filename=students.csv;');
                res.status(200).end(csvFile, 'binary');
            });
        });
    }).catch(function (err) {
        res.status(500).send(err || 'model not accessible');
    });
};

exports.default = {
    exportStudentCSV: exportStudentCSV
};