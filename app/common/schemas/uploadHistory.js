export default Schema => ({
    type: String,
    when: Date,
    source: String,
    comment: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    success: {
        type: Boolean,
        default: false
    }
});
