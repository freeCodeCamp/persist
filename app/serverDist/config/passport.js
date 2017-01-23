'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _passportJwt = require('passport-jwt');

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Setting username field to email rather than username
var localOptions = {
    usernameField: 'email'
};

// Setting up local login strategy
var localLogin = new _passportLocal2.default(localOptions, function (email, password, done) {
    _user2.default.findOne({ email: email }).select('+password').exec(function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            console.log('user not');
            return done(null, false, { error: 'Your login details could not be verified. Please try again.' });
        }
        if (!user.enabled) {
            return done(null, false, { error: 'Your account has been disabled. Please contact administrator.' });
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                console.log('password not');
                return done(null, false, { error: 'Your login details could not be verified. Please try again.' });
            }
            return done(null, user);
        });
    });
});

// Setting JWT strategy options
var jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeader(),
    // Telling Passport where to find the secret
    secretOrKey: process.env.SECRET
};

// Setting up JWT login strategy
var jwtLogin = new _passportJwt.Strategy(jwtOptions, function (payload, done) {
    _user2.default.findById(payload._id, function (err, user) {
        if (err) {
            return done(err, false);
        }

        if (user && user.enabled) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

_passport2.default.use(jwtLogin);
_passport2.default.use(localLogin);

exports.default = _passport2.default;