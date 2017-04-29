export default Schema => ({
    type: String,
    when: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    success: {
        type: Boolean,
        default: false
    }
});
