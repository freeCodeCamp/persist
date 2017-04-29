'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _college = require('../models/college');

var _college2 = _interopRequireDefault(_college);

var _mongoose = require('mongoose');

var _forOwn = require('lodash/forOwn');

var _forOwn2 = _interopRequireDefault(_forOwn);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (record, callback) {
    if (!record.osis) {
        callback(null, null);
        return;
    }

    var dateFields = ['enrolBegin', 'enrolEnd'];

    dateFields.forEach(function (dateField) {
        var value = record[dateField];

        if (!value) {
            // console.error('no date, deleting....'.red, logObject);
            delete record[dateField];
        } else {
            if (typeof value === 'number') {
                value = (0, _moment2.default)(value, 'YYYYMMDD').toDate();
            } else {
                value = value.toString().split(/[-\/]/).join(' ');
                value = new Date(value);
            }
            if (value.toString() === 'Invalid Date') {
                // console.log('invalid date, deleting...'.red, logObject);
                delete record[dateField];
            } else {
                // console.log('successfully transformed'.green, logObject);
                record[dateField] = value;
            }
        }
    });

    (0, _forOwn2.default)(record, function (value, key) {
        if (!record[key] || typeof record[key] === 'string' && record[key].length < 1) {
            record[key] = undefined;
        }
    });

    //  reference college
    _college2.default.findOne({
        $or: [{ fullName: record.college }, { shortName: record.college }, { navianceName: record.college }, { collegeScorecardName: record.college }]
    }, function (err, college) {
        if (err) {
            console.log('college not found', err);
            callback(err);
            return;
        }
        if (college) {
            record.college = college._id;
            callback(null, record);
            return;
        }
        callback(null, null);
    });
};