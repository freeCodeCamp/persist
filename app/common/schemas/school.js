export default (Schema) => ({
    name: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});
