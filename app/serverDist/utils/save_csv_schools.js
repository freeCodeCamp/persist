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

var _models = require('../models');

var _fieldKeys = require('../../common/fieldKeys');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapValues = function mapValues(line) {
    return line.map(function (key) {
        var obj = _fieldKeys.schoolKeys.find(function (field) {
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

        var transformer = (0, _streamTransform2.default)(function (record) {
            return record;
        }, function (err, data) {
            if (err) {
                return console.log(err);
            }

            _async2.default.eachLimit(data, 10, function (record, callback) {
                _models.School.findOne({
                    name: record.name
                }, function (err, oldSchool) {
                    if (err) {
                        return callback(err);
                    }
                    // if doesnt exist - create new record
                    if (!oldSchool) {
                        var newSchool = new _models.School(record);
                        newSchool.save(function (err) {
                            if (err) {
                                return callback(err);
                            }
                            callback(null);
                        });
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