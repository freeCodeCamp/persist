'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schemas = require('../../common/schemas');

var _mongoosePaginate = require('mongoose-paginate');

var _mongoosePaginate2 = _interopRequireDefault(_mongoosePaginate);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var UploadHistory = new Schema((0, _schemas.uploadHistorySchema)(Schema));
UploadHistory.plugin(_mongoosePaginate2.default);
exports.default = _mongoose2.default.model('UploadHistory', UploadHistory);