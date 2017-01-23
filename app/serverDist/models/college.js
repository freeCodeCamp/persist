'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schemas = require('../../common/schemas');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var College = new Schema((0, _schemas.collegeSchema)(Schema));
exports.default = _mongoose2.default.model('College', College);

// unused at present
// medSatMath: Number,
// medSatCr: Number,
// locale: String,
// enrollmentYears: {}