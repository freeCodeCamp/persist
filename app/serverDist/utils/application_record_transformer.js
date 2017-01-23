'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _college = require('../models/college');

var _college2 = _interopRequireDefault(_college);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (record, callback) {
    if (!record.osis) {
        callback(null, null);
        return;
    }

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