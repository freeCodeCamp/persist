'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('./user');

Object.defineProperty(exports, 'User', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_user).default;
  }
});

var _college = require('./college');

Object.defineProperty(exports, 'College', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_college).default;
  }
});

var _notification = require('./notification');

Object.defineProperty(exports, 'Notification', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_notification).default;
  }
});

var _school = require('./school');

Object.defineProperty(exports, 'School', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_school).default;
  }
});

var _student = require('./student');

Object.defineProperty(exports, 'Student', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_student).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }