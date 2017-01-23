'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _schemas = require('../../common/schemas');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var Notification = new Schema((0, _schemas.notificationSchema)(Schema), { timestamps: true });
exports.default = _mongoose2.default.model('Notification', Notification);