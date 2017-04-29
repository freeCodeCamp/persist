import Notification from '../models/notification';
import User from '../models/user';
import School from '../models/school';
const handleNotifications = (io, socket) => {
    socket.on('subscribe', data => {
        socket.join(data.room);
    });
    socket.on('unsubscribe', data => {
        socket.leave(data.room);
    });
    socket.on('update', data => {
        if (!data.school || data.school.length < 1) return;
        Notification.create(data, (err, new_not) => {
            if (err || !new_not) {
                return console.log(err);
            }
            Notification.populate(
                new_not,
                {
                    path: 'user student',
                    select: 'profile fullName osis'
                },
                (err, notification) => {
                    if (!err) {
                        socket.broadcast.to(data.school).emit('notification', {
                            notifId: notification,
                            read: false
                        });
                    }
                }
            );

            School.findOne({ _id: data.school }, (err, school) => {
                if (err || !school || !school.users) return;
                const notifyUsers = school.users.filter(user => user.toString() !== data.user.toString());
                const bulk = User.collection.initializeUnorderedBulkOp();
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
            User.find({ 'access.role': 'Owner' }, (err, users) => {
                if (err || users.length < 1) return;
                const notifyUsers = users.filter(user => user.toString() !== data.user.toString());
                const bulk = User.collection.initializeUnorderedBulkOp();
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

export default handleNotifications;
