import {
    ROLE_ADMIN,
    ROLE_OWNER,
    ROLE_COUNSELOR
} from '../../common/constants';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import crypto from 'crypto';
import * as mailgun from '../config/mailgun';

const setUserInfo = (user) => ({
    _id: user._id,
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    email: user.email,
    role: user.access.role,
    school: user.access.school
});

const getRole = (checkRole) => {
    let role;
    switch (checkRole) {
        case ROLE_ADMIN:
            role = 3;
            break;
        case ROLE_OWNER:
            role = 2;
            break;
        case ROLE_COUNSELOR:
            role = 1;
            break;
        default:
            role = 1;
    }
    return role;
};

// Generate JWT
const generateToken = (user) => (
    jwt.sign(user, process.env.SECRET, {
        expiresIn: 100080
    })
);

//= =======================================
// Login Route
//= =======================================
export const login = (req, res, next) => {
    const userInfo = setUserInfo(req.user);
    res.status(200).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
    });
};

//= =======================================
// Registration Route
//= =======================================
export const register = (req, res, next) => {
    // Check for registration errors
    const {email, firstName, lastName, password} = req.body;
    // Return error if no email provided
    if (!email) {
        return res.status(422).send({error: 'You must enter an email address.'});
    }

    // Return error if full name not provided
    if (!firstName) {
        return res.status(422).send({error: 'You must enter your name.'});
    }

    // Return error if no password provided
    if (!password) {
        return res.status(422).send({error: 'You must enter a password.'});
    }

    User.findOne({email}, (err, existingUser) => {
        if (err) {
            return next(err);
        }

        // If user is not unique, return error
        if (existingUser) {
            return res.status(422).send({error: 'That email address is already in use.'});
        }

        // If email is unique and password was provided, create account
        const user = new User({
            email,
            password,
            profile: {firstName, lastName}
        });

        user.save((err, user) => {
            if (err) {
                return next(err);
            }

            // Subscribe member to Mailchimp list
            // mailchimp.subscribeToNewsletter(user.email);

            // Respond with JWT if user was created

            const userInfo = setUserInfo(user);

            res.status(201).json({
                token: `JWT ${generateToken(userInfo)}`,
                user: userInfo
            });
        });
    });
};

//= =======================================
// Authorization Middleware
//= =======================================

// Role authorization check
export const roleAuthorization = (requiredRole) => (
    (req, res, next) => {
        const user = req.user;
        User.findById(user._id, (err, foundUser) => {
            if (err) {
                res.status(422).json({error: 'No user was found.'});
                return next(err);
            }

            // If user is found, check role.
            if (getRole(foundUser.access.role) >= getRole(requiredRole)) {
                return next();
            }

            return res.status(401).json({error: 'You are not authorized to view this content.'});
        });
    }
);

export const forgotPassword = (req, res, next) => {
    const email = req.body.email;

    User.findOne({email}, (err, existingUser) => {
        // If user is not found, return error
        if (err || !existingUser) {
            res.status(422).json({error: 'Your request could not be processed as entered. Please try again.'});
            return next(err);
        }

        // If user is found, generate and save resetToken

        // Generate a token with Crypto
        crypto.randomBytes(48, (err, buffer) => {
            const resetToken = buffer.toString('hex');
            if (err) {
                return next(err);
            }

            existingUser.resetPasswordToken = resetToken;
            existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            existingUser.save((err) => {
                // If error in saving token, return it
                if (err) {
                    return next(err);
                }

                const message = {
                    subject: 'Reset Password',
                    text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://'}${req.headers.host}/reset-password/${resetToken}\n\n` +
                    `If you did not request this, please ignore this email and your password will remain unchanged.\n`
                };
                // Otherwise, send user email via Mailgun
                console.log(message);
                mailgun.sendEmail(existingUser.email, message);

                return res.status(200).json({message: 'Please check your email for the link to reset your password.'});
            });
        });
    });
};

//= =======================================
// Reset Password Route
//= =======================================

export const verifyToken = (req, res, next) => {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, resetUser) => {
        // If query returned no results, token expired or was invalid. Return error.
        if (!resetUser) {
            res.status(422).json({error: 'Your token has expired. Please attempt to reset your password again.'});
        }

        // Otherwise, save new password and clear resetToken from database
        resetUser.password = req.body.password;
        resetUser.resetPasswordToken = undefined;
        resetUser.resetPasswordExpires = undefined;

        resetUser.save((err) => {
            if (err) {
                return next(err);
            }

            // If password change saved successfully, alert user via email
            const message = {
                subject: 'Password Changed',
                text: 'You are receiving this email because you changed your password. \n\n' +
                'If you did not request this change, please contact us immediately.'
            };

            // Otherwise, send user email confirmation of password change via Mailgun
            mailgun.sendEmail(resetUser.email, message);

            return res.status(200).json({message: 'Password changed successfully. Please login with your new password.'});
        });
    });
};

export default {
    login,
    register,
    roleAuthorization,
    forgotPassword,
    verifyToken
};
