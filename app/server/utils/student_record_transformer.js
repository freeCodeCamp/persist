import College from '../models/college';
import compact from 'lodash/compact';
import async from 'async';
import School from '../models/school';
import { studentKeys } from '../../common/fieldKeys';
import exportKeys from '../../common/exportKeys';
import map from 'lodash/map';
import moment from 'moment';
const DELETE_TERM = 'set_undefined';
const typeKeys = exportKeys(map(studentKeys, 'dbName'), studentKeys);

export default function formatRecord(record, callback) {
    if (!record.osis) {
        callback(null);
        return;
    }

    // create full Name
    record.fullName = `${record.firstName || ''} ${record.lastName || ''}`.trim();

    // handle dates
    const dateFields = typeKeys['datepicker'];

    dateFields.forEach(function(dateField) {
        let value = record[dateField];

        if (!value) {
            // console.error('no date, deleting....'.red, logObject);
            delete record[dateField];
        } else {
            if (typeof value === 'number') {
                value = moment(value, 'YYYYMMDD').toDate();
            } else if (value === DELETE_TERM) {
                record[dateField] = value;
            } else {
                value = value
                    .toString()
                    .split(/[-\/]/)
                    .join(' ');
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

    // handle things that should be arrays
    const shouldBeArrays = [...typeKeys['checkbox'], ...typeKeys['checkbox_add']];

    for (let key in record) {
        if (!record.hasOwnProperty(key)) continue;
        // sort out arrays
        if (shouldBeArrays.includes(key)) {
            if (!record[key] || (typeof record[key] === 'string' && record[key].length < 1)) {
                record[key] = [];
            } else {
                record[key] = String(record[key]);
                record[key] = record[key].replace(/,\s+/g, ',');
                record[key] = record[key].split(/[;,]/);
                record[key] = compact(record[key]);
                record[key] = record[key].map(str => str.trim());
            }
            continue;
        }

        // sort out empty strings
        if (!record[key] || (typeof record[key] === 'string' && record[key].length < 1)) {
            record[key] = undefined;
        }
    }

    async.parallel(
        [
            callback2 => {
                if (!record.intendedCollege) {
                    return callback2(null);
                }
                // reference College
                College.findOne(
                    {
                        $or: [
                            { opeid: record.opeid },
                            { fullName: record.intendedCollege },
                            { shortName: record.intendedCollege },
                            { navianceName: record.intendedCollege },
                            { collegeScorecardName: record.intendedCollege }
                        ]
                    },
                    (err, college) => {
                        if (err) {
                            console.log('college not found', err);
                            callback2(err);
                            return;
                        }
                        record.intendedCollege = undefined;
                        if (college) {
                            record.intendedCollege = college._id;
                        }
                        callback2(null);
                    }
                );
            },
            callback2 => {
                // reference school
                School.findOne(
                    {
                        name: record.hs
                    },
                    (err, school) => {
                        if (err) {
                            console.log('school not found', err);
                            return callback2(err);
                        }
                        record.hs = school;
                        callback2(null);
                    }
                );
            }
        ],
        err => {
            if (err) {
                return callback(err);
            }
            callback(null, record);
        }
    );
}
