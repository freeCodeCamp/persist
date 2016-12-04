const ObjectId = window.mongoose.Types.ObjectId;

export default (id) => {
    return (typeof id === 'string' && new ObjectId(id).toString() === id);
}
