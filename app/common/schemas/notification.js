export default (Schema) => ({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
    type: String
});
