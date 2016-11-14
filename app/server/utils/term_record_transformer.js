import College from '../models/college';
import {Schema} from 'mongoose';

export default (record, callback) => {
    if (!record.osis) {
        callback(null, null);
        return;
    }

    const dateFields = ['enrolBegin', 'enrolEnd'];

    dateFields.forEach((dateField) => {
        let value = record[dateField];

        if (!value) {
            // console.error('no date, deleting....'.red, logObject);
            delete record[dateField];
        } else {
            value = value.split(/[-\/]/).join(' ');
            value = new Date(value);
            if (value.toString() === 'Invalid Date') {
                // console.log('invalid date, deleting...'.red, logObject);
                delete record[dateField];
            } else {
                // console.log('successfully transformed'.green, logObject);
                record[dateField] = value;
            }
        }
    });

//  reference college
    College.findOne({
        fullName: record.college
    }, (err, college) => {
        if (err) {
            console.log('college not found', err);
            callback(err);
            return;
        }
        if (college) {
            record.college = college._id;
            callback(null, record);
            return;
        }
        callback(null, null);
    });

}