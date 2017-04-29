'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getNotifications = function getNotifications(req, res) {
    var offset = req.body.offset;
    var limit = req.body.limit;
    var user = req.user;
    _user2.default.findOne({ _id: user._id }, { notifications: { $slice: [offset, limit] } }).populate({
        path: 'notifications.notifId',
        populate: {
            path: 'user student',
            select: 'profile fullName osis'
        }
    }).exec(function (err, user) {
        if (err || !user) {
            return res.status(500).send(err || 'User not found');
        }
        res.status(200).json({
            lastAllRead: user.lastAllRead,
            notifications: user.notifications
        });
    });
};

var markRead = function markRead(req, res) {
    var user = req.user;
    var notifId = req.body.notifId;
    _user2.default.findOne({ _id: user._id }).update({ 'notifications.notifId': notifId }, {
        $set: {
            'notifications.$.read': true
        }
    }).exec(function (err, status) {
        if (err) {
            return res.status(500).send(err);
        }
        console.log(notifId, status);
        return res.status(200).json({ status: 'done' });
    });
};

var allRead = function allRead(req, res) {
    var user = req.user;
    _user2.default.findOne({ _id: user._id }).update({}, {
        $set: {
            lastAllRead: new Date()
        }
    }).exec(function (err, status) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).json({ lastAllRead: user.lastAllRead });
    });
};

exports.default = {
    getNotifications: getNotifications,
    markRead: markRead,
    allRead: allRead
};