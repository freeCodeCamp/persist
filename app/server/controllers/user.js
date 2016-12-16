import User from '../models/user';
import crypto from 'crypto';
import * as mailgun from '../config/mailgun';

export const inviteUser = (req, res, next) => {
    const userDetails = req.body;
    userDetails.password = crypto.randomBytes(16).toString('hex');
    const email = userDetails.email;

    User.findOne({email}, (err, existingUser) => {
        // If user is not found, return error
        if (err) {
            res.status(422).json({error: 'Your request could not be processed as entered. Please try again.'});
            return next(err);
        }
        if (!existingUser) {
            crypto.randomBytes(48, (err, buffer) => {
                const resetToken = buffer.toString('hex');
                if (err) {
                    return next(err);
                }
                User.create(userDetails, (err, newUser) => {
                    if (err) return next(err);
                    newUser.resetPasswordToken = resetToken;
                    newUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    newUser.save((err) => {
                        // If error in saving token, return it
                        if (err) {
                            return next(err);
                        }

                        const message = {
                            subject: 'Invitation for NYC Outward Bound',
                            text: `${'\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            'http://'}${req.headers.host}/invite/${resetToken}\n\n` +
                            `If you did not request this, please ignore this email.\n`
                        };
                        // Otherwise, send user email via Mailgun
                        console.log(message);
                        mailgun.sendEmail(newUser.email, message);

                        return res.status(200).json(newUser);
                    });

                });
            });
        } else {
            res.status(422).json({error: 'Your request could not be processed as entered. Please try again.'});
            return next(err);
        }
    });
};

//= =======================================
// Update User
//= =======================================
export const updateUser = (req, res, next) => {
    const {email, enabled} = req.body;

    User.findOne({email}, (err, existingUser) => {
        // If user is not found, return error
        if (err || !existingUser) {
            res.status(422).json({error: 'Your request could not be processed as entered. Please try again.'});
            return next(err);
        }

        existingUser.enabled = enabled;
        existingUser.save((err) => {
            // If error in saving token, return it
            if (err) {
                return next(err);
            }
            let status = '';
            if (enabled) {
                status = 'enabled';
            } else {
                status = 'disabled';
            }
            const message = {
                subject: `Account ${status}`,
                text: `Hello ${existingUser.profile.firstName},\n\nYour account has been ${status}.`
            };

            // send user email via Mailgun
            mailgun.sendEmail(existingUser.email, message);

            return res.status(200).json({message: `Account ${status}`});
        });
    });
};

//= =======================================
// Delete User
//= =======================================
export const deleteUser = (req, res, next) => {
    const {_id} = req.query;

    User.remove({_id}, (err) => {
        // If user is not found, return error
        if (err) {
            res.status(422).json({error: 'Your request could not be processed as entered. Please try again.'});
            return next(err);
        }
        return res.status(200).json({message: 'Account Deleted'});
    });
};

//= =======================================
// GET ALL USERS
//= =======================================
export const getUsers = (req, res, next) => {
    User.find({'access.role': {$ne: 'Admin'}}, (err, users) => {
        if (err) {
            res.status(422).json({error: 'Your request could not be processed as entered. Please try again.'});
            return next(err);
        }
        return res.status(200).json(users);
    });
};

export default {
    inviteUser,
    updateUser,
    deleteUser,
    getUsers
};

