import mongoose from 'mongoose';
import async from 'async';

const Schema = mongoose.Schema;

const schoolSchema = new Schema({
    name: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const schoolNames = ['Baldwin', 'BCS', 'Channel View', 'Hahn',
    'Leaders', 'McCown', 'MELS', 'WHEELS', 'Network'];
const School = mongoose.model('School', schoolSchema);

async.each(schoolNames, (schoolName, callback) => {
    School.findOne({name: schoolName}, (err, existingSchool) => {
        if (err) {
            return callback(err);
        }
        if (!existingSchool) {
            return School.create({name: schoolName}, (err, newSchool) => {
                if (err) {
                    return callback(err);
                }
                return callback();
            });
        }
        return callback();
    });
}, (err) => {
    if (err) {
        return console.log(err);
    }
});

export default School;
