import mongoose from 'mongoose';
import {userSchema} from '../../common/schemas';
import bcrypt from 'bcrypt-nodejs';
const Schema = mongoose.Schema;
const User = new Schema(userSchema(Schema), {timestamps: true});

User.pre('save', function (next) {
    const user = this;
    const SALT_FACTOR = 5;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

User.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }

        cb(null, isMatch);
    });
};

const userModel = mongoose.model('User', User);

// create admin user
const adminUser = {
    profile: {
        firstName: 'Sachin',
        lastName: 'Mour'
    },
    email: 'rtr.sachinmour@gmail.com',
    password: process.env.ADMIN_PASSWORD,
    access: {
        role: 'Admin'
    },
    enabled: true
};
userModel.findOne({email: adminUser.email}, (err, existingUser) => {
    if (!existingUser) {
        userModel.create(adminUser, (err, newAdmin) => {
            if (err) {
                return console.log('admin not created', err);
            }
        });
    }
});

export default userModel;
