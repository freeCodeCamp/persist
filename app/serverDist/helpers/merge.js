'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var merge = function merge() {
    var A = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var B = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _lodash2.default.forOwn(B, function (value, key) {
        if (_lodash2.default.isPlainObject(A[key])) {
            if (_lodash2.default.isPlainObject(B[key])) {
                merge(A[key], B[key]);
            }
        } else if (_lodash2.default.isArray(A[key])) {
            if (_lodash2.default.isArray[B[key]]) {
                B[key].forEach(function (value) {
                    if (!A[key].includes[value]) {
                        A[key].push(value);
                    }
                });
            }
        } else {
            if (B[key]) {
                A[key] = B[key];
            }
        }
    });
    return A;
};

exports.default = merge;