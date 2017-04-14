'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getUsers = exports.deleteUser = exports.updateUser = exports.inviteUser = undefined;

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _school = require('../models/school');

var _school2 = _interopRequireDefault(_school);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _mailgun = require('../config/mailgun');

var mailgun = _interopRequireWildcard(_mailgun);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saveUser = function saveUser(req, res, newUser, resetToken, err) {
    // If error in saving token, return it
    if (err) {
        return next(err);
    }

    var message = {
        subject: 'Invitation for NYC Outward Bound',
        text: '' + ('\n\n' + 'Please click on the following link, or paste this into your browser to complete the process:\n\n' + 'http://') + req.headers.host + '/invite/' + resetToken + '\n\n' + 'If you did not request this, please ignore this email.\n'
    };
    // Otherwise, send user email via Mailgun
    console.log(message);
    mailgun.sendEmail(newUser.email, message);

    return res.status(200).json(newUser);
};

var inviteUser = exports.inviteUser = function inviteUser(req, res, next) {
    var userDetails = req.body;
    userDetails.password = _crypto2.default.randomBytes(16).toString('hex');
    var email = userDetails.email;

    _user2.default.findOne({ email: email }, function (err, existingUser) {
        // If user is not found, return error
        if (err) {
            res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
            return next(err);
        }
        if (!existingUser) {
            _crypto2.default.randomBytes(48, function (err, buffer) {
                var resetToken = buffer.toString('hex');
                if (err) {
                    return next(err);
                }
                _user2.default.create(userDetails, function (err, newUser) {
                    if (err) return next(err);
                    newUser.resetPasswordToken = resetToken;
                    newUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    var schoolId = userDetails.access.school;
                    if (schoolId) {
                        _school2.default.findOne({ _id: schoolId }, function (err, existingSchool) {
                            if (err) return next(err);
                            existingSchool.users.push(newUser._id);
                            existingSchool.save(function (err) {
                                if (err) return next(err);
                                newUser.save(saveUser.bind(null, req, res, newUser, resetToken));
                            });
                        });
                    } else {
                        newUser.save(saveUser.bind(null, req, res, newUser, resetToken));
                    }
                });
            });
        } else {
            res.status(400).json({ error: 'User already exists' });
            return next(err);
        }
    });
};

//= =======================================
// Update User
//= =======================================
var updateUser = exports.updateUser = function updateUser(req, res, next) {
    var _req$body = req.body,
        email = _req$body.email,
        enabled = _req$body.enabled;


    _user2.default.findOne({ email: email }, function (err, existingUser) {
        // If user is not found, return error
        if (err || !existingUser) {
            res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
            return next(err);
        }

        existingUser.enabled = enabled;
        existingUser.save(function (err) {
            // If error in saving token, return it
            if (err) {
                return next(err);
            }
            var status = '';
            if (enabled) {
                status = 'enabled';
            } else {
                status = 'disabled';
            }
            var message = {
                subject: 'Account ' + status,
                text: 'Hello ' + existingUser.profile.firstName + ',\n\nYour account has been ' + status + '.'
            };

            // send user email via Mailgun
            mailgun.sendEmail(existingUser.email, message);

            return res.status(200).json({ message: 'Account ' + status });
        });
    });
};

//= =======================================
// Delete User
//= =======================================
var deleteUser = exports.deleteUser = function deleteUser(req, res, next) {
    var _id = req.query._id;


    _user2.default.remove({ _id: _id }, function (err) {
        // If user is not found, return error
        if (err) {
            res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
            return next(err);
        }
        return res.status(200).json({ message: 'Account Deleted' });
    });
};

//= =======================================
// GET ALL USERS
//= =======================================
var getUsers = exports.getUsers = function getUsers(req, res, next) {

    _user2.default.find({
        $and: [{ 'access.role': { $ne: 'Admin' } }, { _id: { $ne: req.user._id } }]
    }, function (err, users) {
        if (err) {
            res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
            return next(err);
        }
        return res.status(200).json(users);
    });
};

exports.default = {
    inviteUser: inviteUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getUsers: getUsers
};