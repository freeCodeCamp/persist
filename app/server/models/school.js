import {schoolSchema} from '../../common/schemas';
import mongoose from 'mongoose';
import async from 'async';

const Schema = mongoose.Schema;

const schoolSchemaModel = new Schema(schoolSchema(Schema));

const schoolNames = ['Baldwin', 'Brooklyn Collaborative', 'Channel View', 'Kurt Hahn',
    'Leaders', 'Gaynor McCown', 'MELS', 'WHEELS'];
const School = mongoose.model('School', schoolSchemaModel);

async.each(schoolNames, (schoolName, callback) => {
    School.findOne({ name: schoolName }, (err, existingSchool) => {
        if (err) {
            return callback(err);
        }
        if (!existingSchool) {
            return School.create({ name: schoolName }, (err, newSchool) => {
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
