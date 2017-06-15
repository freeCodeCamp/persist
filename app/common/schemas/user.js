import { isEmail } from 'validator';
import { ROLE_ADMIN, ROLE_OWNER, ROLE_COUNSELOR } from '../constants';

const accessSchema = Schema => ({
    role: {
        type: String,
        enum: [ROLE_ADMIN, ROLE_OWNER, ROLE_COUNSELOR]
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School'
    }
});

const notificationSchema = Schema => ({
    read: {
        type: Boolean,
        default: false
    },
    notifId: {
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }
});

const checkAccess = access => (access.role === ROLE_COUNSELOR ? !!access.school : true);

export default Schema => ({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        validate: {
          isAsync: false,
          validator: isEmail,
          message: 'Must provide a valid email address',
        },
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    profile: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    enabled: {
        type: Boolean,
        default: true
    },
    access: {
        type: accessSchema(Schema),
        validate: {
            validator: checkAccess,
            message: 'School must be selected'
        },
        default: {}
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    notifications: [notificationSchema(Schema)],
    lastAllRead: Date
});
