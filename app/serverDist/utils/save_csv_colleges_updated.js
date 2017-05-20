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
            (0, _lodash.forOwn)(_college2.default.schema.obj, function (value, key) {
                if (value.name && value.name.toString() === 'Number') {
                    record[key] = Number(record[key]);
                    if (!(0, _lodash.isFinite)(record[key])) {
                        delete record[key];
                    }
                }
            });
            return record;
        });

        var data = {};
        var row = void 0;
        transformer.on('readable', function () {
            while (row = transformer.read()) {
                var uniqueName = ('' + (row.opeid || '')).trim();
                if (uniqueName.length > 0) {
                    data[uniqueName] = data[uniqueName] || (0, _lodash.clone)({});
                    data[uniqueName] = (0, _merge2.default)(data[uniqueName], row);
                }
            }
        });

        var error = [];

        transformer.on('error', function (err) {
            error.push(err);
            console.log(err.message);
        });

        transformer.on('end', function () {
            if (error.length > 0) return reject((0, _lodash.uniqWith)(error, _lodash.isEqual));
            _async2.default.eachLimit(data, 10, function (record, callback) {
                _college2.default.findOne({ opeid: record.opeid }, function (err, oldCollege) {
                    if (err) {
                        console.log('error in finding document', err);
                        return callback(err);
                    }
                    if (!oldCollege) {
                        var college = new _college2.default(record);
                        college.save(function (err) {
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
                        var newRecord = {};
                        (0, _lodash.forOwn)(record, function (value, key) {
                            (0, _lodash.set)(newRecord, key, value);
                        });
                        var collegeObject = oldCollege.toObject();
                        var newCollege = (0, _merge2.default)(collegeObject, newRecord);
                        (0, _lodash.forOwn)(collegeObject, function (value, key) {
                            if (key !== '_id' && newCollege[key]) {
                                oldCollege[key] = newCollege[key];
                            }
                        });
                        oldCollege.save(function (err) {
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

var _streamTransform = require('stream-transform');

var _streamTransform2 = _interopRequireDefault(_streamTransform);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _lodash = require('lodash');

var _merge = require('../helpers/merge');

var _merge2 = _interopRequireDefault(_merge);

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