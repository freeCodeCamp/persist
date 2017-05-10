'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var setUndefined = function setUndefined(record) {
    (0, _lodash.forOwn)(record, function (value, key) {
        if (record[key] === 'set undefined') {
            record[key] = undefined;
        }
    });
};

exports.default = setUndefined;