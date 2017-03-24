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

        var transformer = (0, _streamTransform2.default)(function (record) {

            (0, _forOwn2.default)(_college2.default.schema.obj, function (value, key) {
                if (value.name && value.name.toString() === 'Number') {
                    record[key] = Number(record[key]);
                    if (!(0, _isFinite2.default)(record[key])) {
                        delete record[key];
                    }
                }
            });
            return record;
        }, function (err, data) {
            if (err) {
                console.log(err);
                return;
            }

            // reduce data size for testing
            // data = data.splice(0, 10);
            var addedCount = 0;
            var modifiedCount = 0;
            var newColleges = [];
            var updatedColleges = [];

            _async2.default.eachLimit(data, 10, function (record, callback) {

                _college2.default.findOne({
                    fullName: record.fullName
                }, function (err, oldCollege) {

                    // if doesnt exist - create new record
                    if (!oldCollege) {
                        var college = new _college2.default(record);
                        college.save(function (err) {
                            if (err) {
                                if (err.code === 11000) {
                                    return callback(null);
                                }
                                return callback(null);
                            }
                            return callback(null);
                        });
                    } else {
                        modifiedCount++;
                        var collegeObject = oldCollege.toObject();
                        var newCollege = (0, _merge2.default)(collegeObject, record);
                        (0, _forOwn2.default)(collegeObject, function (value, key) {
                            if (key !== '_id' && newCollege[key]) {
                                oldCollege[key] = newCollege[key];
                            }
                        });
                        oldCollege.save(function (err) {
                            if (err) {
                                if (err.code === 11000) {
                                    return callback(null);
                                }
                                return callback(null);
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
                resolve({
                    modifiedCount: modifiedCount,
                    addedCount: addedCount
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

var _streamTransform = require('stream-transform');

var _streamTransform2 = _interopRequireDefault(_streamTransform);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _isFinite = require('lodash/isFinite');

var _isFinite2 = _interopRequireDefault(_isFinite);

var _forOwn = require('lodash/forOwn');

var _forOwn2 = _interopRequireDefault(_forOwn);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _college = require('../models/college');

var _college2 = _interopRequireDefault(_college);

var _fieldKeys = require('../../common/fieldKeys');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapValues(line) {

    return line.map(function (key) {
        var obj = _fieldKeys.collegeKeys.find(function (field) {
            return field.fieldName === key;
        });
        if (obj) {
            return obj.dbName;
        }
        return key;
    });
}