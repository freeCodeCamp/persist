'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _schemas = require('../../common/schemas');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var schoolSchemaModel = new Schema((0, _schemas.schoolSchema)(Schema));

var schoolNames = ['Baldwin', 'BCS', 'Channel View', 'Hahn', 'Leaders', 'McCown', 'MELS', 'WHEELS'];
var School = _mongoose2.default.model('School', schoolSchemaModel);

_async2.default.each(schoolNames, function (schoolName, callback) {
    School.findOne({ name: schoolName }, function (err, existingSchool) {
        if (err) {
            return callback(err);
        }
        if (!existingSchool) {
            return School.create({ name: schoolName }, function (err, newSchool) {
                if (err) {
                    return callback(err);
                }
                return callback();
            });
        }
        return callback();
    });
}, function (err) {
    if (err) {
        return console.log(err);
    }
});

exports.default = School;