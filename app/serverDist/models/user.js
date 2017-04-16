'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _schemas = require('../../common/schemas');

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var User = new Schema((0, _schemas.userSchema)(Schema), { timestamps: true });

User.pre('save', function (next) {
    var user = this;
    var SALT_FACTOR = 5;
    if (!user.isModified('password')) return next();

    _bcryptNodejs2.default.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) return next(err);

        _bcryptNodejs2.default.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

User.methods.comparePassword = function (candidatePassword, cb) {
    _bcryptNodejs2.default.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }

        cb(null, isMatch);
    });
};

var userModel = _mongoose2.default.model('User', User);

// create admin user
var adminUser = {
    profile: {
        firstName: 'Sachin',
        lastName: 'Mour'
    },
    email: 'rtr.sachinmour@gmail.com',
    access: {
        role: 'Admin'
    },
    enabled: true
};
userModel.findOne({ email: adminUser.email }, function (err, existingUser) {
    if (!existingUser) {
        adminUser.password = process.env.ADMIN_PASSWORD;
        userModel.create(adminUser, function (err, newAdmin) {
            if (err) {
                return console.log('admin not created', err);
            }
        });
    }
});

exports.default = userModel;