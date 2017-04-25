'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.verifyToken = exports.forgotPassword = exports.roleAuthorization = exports.register = exports.login = undefined;

var _constants = require('../../common/constants');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _mailgun = require('../config/mailgun');

var mailgun = _interopRequireWildcard(_mailgun);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setUserInfo = function setUserInfo(user) {
    return {
        _id: user._id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        email: user.email,
        role: user.access.role,
        school: user.access.school
    };
};

var getRole = function getRole(checkRole) {
    var role = void 0;
    switch (checkRole) {
        case _constants.ROLE_ADMIN:
            role = 3;
            break;
        case _constants.ROLE_OWNER:
            role = 2;
            break;
        case _constants.ROLE_COUNSELOR:
            role = 1;
            break;
        default:
            role = 0;
    }
    return role;
};

// Generate JWT
var generateToken = function generateToken(user) {
    return _jsonwebtoken2.default.sign(user, process.env.SECRET, {
        expiresIn: 100080
    });
};

//= =======================================
// Login Route
//= =======================================
var login = exports.login = function login(req, res, next) {
    var userInfo = setUserInfo(req.user);
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
};

//= =======================================
// Registration Route
//= =======================================
var register = exports.register = function register(req, res, next) {
    // Check for registration errors
    var _req$body = req.body,
        email = _req$body.email,
        firstName = _req$body.firstName,
        lastName = _req$body.lastName,
        password = _req$body.password;
    // Return error if no email provided

    if (!email) {
        return res.status(422).send({ error: 'You must enter an email address.' });
    }

    // Return error if full name not provided
    if (!firstName) {
        return res.status(422).send({ error: 'You must enter your name.' });
    }

    // Return error if no password provided
    if (!password) {
        return res.status(422).send({ error: 'You must enter a password.' });
    }

    _user2.default.findOne({ email: email }, function (err, existingUser) {
        if (err) {
            return next(err);
        }

        // If user is not unique, return error
        if (existingUser) {
            return res.status(422).send({ error: 'That email address is already in use.' });
        }

        // If email is unique and password was provided, create account
        var user = new _user2.default({
            email: email,
            password: password,
            profile: { firstName: firstName, lastName: lastName }
        });

        user.save(function (err, user) {
            if (err) {
                return next(err);
            }

            // Subscribe member to Mailchimp list
            // mailchimp.subscribeToNewsletter(user.email);

            // Respond with JWT if user was created

            var userInfo = setUserInfo(user);

            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            });
        });
    });
};

//= =======================================
// Authorization Middleware
//= =======================================

// Role authorization check
var roleAuthorization = exports.roleAuthorization = function roleAuthorization(requiredRole) {
    return function (req, res, next) {
        var user = req.user;
        _user2.default.findById(user._id, function (err, foundUser) {
            if (err) {
                res.status(422).json({ error: 'No user was found.' });
                return next(err);
            }

            // If user is found, check role.
            if (getRole(foundUser.access.role) >= getRole(requiredRole)) {
                return next();
            }

            return res.status(401).json({ error: 'You are not authorized to view this content.' });
        });
    };
};

var forgotPassword = exports.forgotPassword = function forgotPassword(req, res, next) {
    var email = req.body.email;

    _user2.default.findOne({ email: email }, function (err, existingUser) {
        // If user is not found, return error
        if (err || !existingUser) {
            res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
            return next(err);
        }

        // If user is found, generate and save resetToken

        // Generate a token with Crypto
        _crypto2.default.randomBytes(48, function (err, buffer) {
            var resetToken = buffer.toString('hex');
            if (err) {
                return next(err);
            }

            existingUser.resetPasswordToken = resetToken;
            existingUser.resetPasswordExpires = Date.now() + 36000000; // 10 hour

            existingUser.save(function (err) {
                // If error in saving token, return it
                if (err) {
                    return next(err);
                }

                var message = {
                    subject: 'Reset Password',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n\n                    Please click on the following link, or paste this into your browser to complete the process:\n\n\n                    ' + process.env.ROOT_SCHEME + '://' + process.env.ROOT_HOST + '/reset-password/' + resetToken + '\n\n\n                    If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                // Otherwise, send user email via Mailgun
                console.log(message);
                mailgun.sendEmail(existingUser.email, message);

                return res.status(200).json({ message: 'Please check your email for the link to reset your password.' });
            });
        });
    });
};

//= =======================================
// Reset Password Route
//= =======================================

var verifyToken = exports.verifyToken = function verifyToken(req, res, next) {
    _user2.default.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, resetUser) {
        // If query returned no results, token expired or was invalid. Return error.
        if (!resetUser) {
            return res.status(422).json({ error: 'Your token has expired. Please attempt to reset your password again.' });
        }

        // Otherwise, save new password and clear resetToken from database
        resetUser.password = req.body.password;
        resetUser.resetPasswordToken = undefined;
        resetUser.resetPasswordExpires = undefined;

        resetUser.save(function (err) {
            if (err) {
                return next(err);
            }

            // If password change saved successfully, alert user via email
            var message = {
                subject: 'Password Changed',
                text: 'You are receiving this email because you changed your password. \n\n' + 'If you did not request this change, please contact us immediately.'
            };

            // Otherwise, send user email confirmation of password change via Mailgun
            mailgun.sendEmail(resetUser.email, message);

            return res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' });
        });
    });
};

exports.default = {
    login: login,
    register: register,
    roleAuthorization: roleAuthorization,
    forgotPassword: forgotPassword,
    verifyToken: verifyToken
};