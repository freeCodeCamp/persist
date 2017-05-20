import College from '../models/college';
import { Schema } from 'mongoose';
import forOwn from 'lodash/forOwn';
import moment from 'moment';

export default (record, callback) => {
    if (!record.osis) {
        callback(null);
        return;
    }

    const dateFields = ['enrolBegin', 'enrolEnd'];

    dateFields.forEach(dateField => {
        let value = record[dateField];

        if (!value) {
            // console.error('no date, deleting....'.red, logObject);
            delete record[dateField];
        } else {
            if (typeof value === 'number') {
                value = moment(value, 'YYYYMMDD').toDate();
            } else {
                value = value.toString().split(/[-\/]/).join(' ');
                value = new Date(value);
            }
            if (value.toString() === 'Invalid Date') {
                // console.log('invalid date, deleting...'.red, logObject);
                delete record[dateField];
            } else {
                // console.log('successfully transformed'.green, logObject);
                record[dateField] = value;
            }
        }
    });

    forOwn(record, (value, key) => {
        if (!record[key] || (typeof record[key] === 'string' && record[key].length < 1)) {
            record[key] = undefined;
        }
    });
    if (!record.college) {
        record.college = 'set undefined';
        return callback(null);
    }
    //  reference college
    College.findOne(
        {
            $or: [
                { opeid: record.opeid },
                { fullName: record.college },
                { shortName: record.college },
                { navianceName: record.college },
                { collegeScorecardName: record.college }
            ]
        },
        (err, college) => {
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
        }
    );
};
