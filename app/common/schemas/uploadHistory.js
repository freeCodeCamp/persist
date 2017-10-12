export default Schema => ({
    type: String,
    when: Date,
    source: String,
    comments: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    success: {
        type: Boolean,
        default: false
    }
});
