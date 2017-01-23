'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _notification = require('./notification');

var _notification2 = _interopRequireDefault(_notification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (io, socket) {
    (0, _notification2.default)(io, socket);
};