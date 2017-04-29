import passport from 'passport';
import User from '../models/user';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import LocalStrategy from 'passport-local';

// Setting username field to email rather than username
const localOptions = {
    usernameField: 'email'
};

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    User.findOne({ email }).select('+password').exec((err, user) => {
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
        user.comparePassword(password, (err, isMatch) => {
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
const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    // Telling Passport where to find the secret
    secretOrKey: process.env.SECRET
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload._id, (err, user) => {
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

passport.use(jwtLogin);
passport.use(localLogin);

export default passport;
