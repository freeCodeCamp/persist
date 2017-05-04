'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = formatRecord;

var _college = require('../models/college');

var _college2 = _interopRequireDefault(_college);

var _compact = require('lodash/compact');

var _compact2 = _interopRequireDefault(_compact);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _school = require('../models/school');

var _school2 = _interopRequireDefault(_school);

var _fieldKeys = require('../../common/fieldKeys');

var _exportKeys = require('../../common/exportKeys');

var _exportKeys2 = _interopRequireDefault(_exportKeys);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var typeKeys = (0, _exportKeys2.default)((0, _map2.default)(_fieldKeys.studentKeys, 'dbName'), _fieldKeys.studentKeys);

function formatRecord(record, callback) {
    if (!record.osis) {
        callback(null, null);
        return;
    }

    // create full Name
    record.fullName = ((record.firstName || '') + ' ' + (record.lastName || '')).trim();

    // handle dates
    var dateFields = typeKeys['datepicker'];

    dateFields.forEach(function (dateField) {
        var value = record[dateField];

        if (!value) {
            // console.error('no date, deleting....'.red, logObject);
            delete record[dateField];
        } else {
            value = value.split(/[-\/]/).join(' ');
            value = new Date(value);
            if (value.toString() === 'Invalid Date') {
                // console.log('invalid date, deleting...'.red, logObject);
                delete record[dateField];
            } else {
                // console.log('successfully transformed'.green, logObject);
                record[dateField] = value;
            }
        }
    });

    // handle things that should be arrays
    var shouldBeArrays = [].concat(_toConsumableArray(typeKeys['checkbox']), _toConsumableArray(typeKeys['checkbox_add']));

    for (var key in record) {
        if (!record.hasOwnProperty(key)) continue;
        // sort out arrays
        if (shouldBeArrays.includes(key)) {
            if (!record[key] || typeof record[key] === 'string' && record[key].length < 1) {
                record[key] = [];
            } else {
                record[key] = String(record[key]);
                record[key] = record[key].replace(/,\s+/g, ',');
                record[key] = record[key].split(/[;,]/);
                record[key] = (0, _compact2.default)(record[key]);
                record[key] = record[key].map(function (str) {
                    return str.trim();
                });
            }
            continue;
        }

        // sort out empty strings
        if (!record[key] || typeof record[key] === 'string' && record[key].length < 1) {
            record[key] = undefined;
        }
    }

    _async2.default.parallel([function (callback2) {
        if (!record.intendedCollege) {
            record.intendedCollege = 'set undefined';
            return callback2(null);
        }
        // reference College
        _college2.default.findOne({
            $or: [{ fullName: record.intendedCollege }, { shortName: record.intendedCollege }, { navianceName: record.intendedCollege }, { collegeScorecardName: record.intendedCollege }]
        }, function (err, college) {
            if (err) {
                console.log('college not found', err);
                callback2(err);
                return;
            }
            record.intendedCollege = undefined;
            if (college) {
                record.intendedCollege = college._id;
            }
            callback2(null);
        });
    }, function (callback2) {
        // reference school
        _school2.default.findOne({
            name: record.hs
        }, function (err, school) {
            if (err) {
                console.log('school not found', err);
                return callback2(err);
            }
            record.hs = school;
            callback2(null);
        });
    }], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, record);
    });
}