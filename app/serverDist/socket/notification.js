'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _notification = require('../models/notification');

var _notification2 = _interopRequireDefault(_notification);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _school = require('../models/school');

var _school2 = _interopRequireDefault(_school);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handleNotifications = function handleNotifications(io, socket) {

    socket.on('subscribe', function (data) {
        socket.join(data.room);
    });
    socket.on('unsubscribe', function (data) {
        socket.leave(data.room);
    });
    socket.on('update', function (data) {
        if (!data.school || data.school.length < 1) return;
        _notification2.default.create(data, function (err, new_not) {
            if (err || !new_not) {
                return console.log(err);
            }
            _notification2.default.populate(new_not, {
                path: 'user student',
                select: 'profile fullName osis'
            }, function (err, notification) {
                if (!err) {
                    socket.broadcast.to(data.school).emit('notification', {
                        notifId: notification,
                        read: false
                    });
                }
            });

            _school2.default.findOne({ _id: data.school }, function (err, school) {
                if (err || !school || !school.users) return;
                var notifyUsers = school.users.filter(function (user) {
                    return user.toString() !== data.user.toString();
                });
                var bulk = _user2.default.collection.initializeUnorderedBulkOp();
                bulk.find({ _id: { $in: notifyUsers } }).update({
                    $push: {
                        notifications: {
                            $each: [{ notifId: new_not._id, read: false }],
                            $position: 0
                        }
                    }
                });
                bulk.execute();
            });
            _user2.default.find({ 'access.role': 'Owner' }, function (err, users) {
                if (err || users.length < 1) return;
                var notifyUsers = users.filter(function (user) {
                    return user.toString() !== data.user.toString();
                });
                var bulk = _user2.default.collection.initializeUnorderedBulkOp();
                bulk.find({ _id: { $in: notifyUsers } }).update({
                    $push: {
                        notifications: {
                            $each: [{ notifId: new_not._id, read: false }],
                            $position: 0
                        }
                    }
                });
                bulk.execute();
            });
        });
    });
};

exports.default = handleNotifications;