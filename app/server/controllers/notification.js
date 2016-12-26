import User from '../models/user';

const getNotifications = (req, res) => {
    const offset = req.body.offset;
    const limit = req.body.limit;
    User.findOne(
        {_id: '585cf33604388a0d63fd9f6a'},
        {'notifications': {$slice: [offset * limit, limit]}}
    )
        .populate({
            path: 'notifications.notifId',
            populate: {
                path: 'user student',
                select: 'profile fullName'
            }
        })
        .exec((err, user) => {
            if (err || !user) {
                return res.status(500).send(err || 'User not found');
            }
            res.status(200).json({
                lastAllRead: user.lastAllRead,
                notifications: user.notifications
            });
        });
};

const markRead = (req, res) => {
    const user = req.user;
    const notifId = req.notifId;
    User.findOne({_id: user._id})
        .update({'notifications.notifId': notifId},
            {
                '$set': {
                    'notifications.$.read': true
                }
            })
        .exec((err, status) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.status(200).json({status: 'done'});
        });
};

const allRead = (req, res) => {
    const user = req.user;
    User.findOne({_id: user._id})
        .update({},
            {
                '$set': {
                    lastAllRead: new Date()
                }
            })
        .exec((err, status) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.status(200).json({lastAllRead: user.lastAllRead});
        });
};

export default {
    getNotifications,
    markRead,
    allRead
};
