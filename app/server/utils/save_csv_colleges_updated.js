import fs from 'fs';
import parse from 'csv-parse';
import transform from 'stream-transform';
import async from 'async';
import { set, clone, isFinite, forOwn, uniqWith, isEqual } from 'lodash';
import myMerge from '../helpers/merge';
import College from '../models/college';
import { collegeKeys } from '../../common/fieldKeys';

export default function(fileName) {
    return new Promise((resolve, reject) => {
        const parser = parse({
            delimiter: ',',
            columns: mapValues,
            auto_parse: true
        });

        const transformer = transform(function(record) {
            forOwn(College.schema.obj, (value, key) => {
                if (value.name && value.name.toString() === 'Number') {
                    record[key] = Number(record[key]);
                    if (!isFinite(record[key])) {
                        delete record[key];
                    }
                }
            });
            return record;
        });

        const data = {};
        let row;
        transformer.on('readable', () => {
            while ((row = transformer.read())) {
                const uniqueName = `${row.opeid || ''}`.trim();
                if (uniqueName.length > 0) {
                    data[uniqueName] = data[uniqueName] || clone({});
                    data[uniqueName] = myMerge(data[uniqueName], row);
                }
            }
        });

        const error = [];

        transformer.on('error', err => {
            error.push(err);
            console.log(err.message);
        });

        transformer.on('end', () => {
            if (error.length > 0) return reject(uniqWith(error, isEqual));
            async.eachLimit(
                data,
                10,
                (record, callback) => {
                    College.findOne({ opeid: record.opeid }, (err, oldCollege) => {
                        if (err) {
                            console.log('error in finding document', err);
                            return callback(err);
                        }
                        if (!oldCollege) {
                            const college = new College(record);
                            college.save(err => {
                                if (err) {
                                    if (err.code === 11000) {
                                        return callback(null);
                                    }
                                    console.log('we got a validation error', err);
                                    return callback(err);
                                }
                                return callback(null);
                            });
                        } else {
                            const newRecord = {};
                            forOwn(record, (value, key) => {
                                set(newRecord, key, value);
                            });
                            const collegeObject = oldCollege.toObject();
                            const newCollege = myMerge(collegeObject, newRecord);
                            forOwn(collegeObject, (value, key) => {
                                if (key !== '_id') {
                                    if (newCollege[key] === 'set undefined') {
                                        oldCollege[key] = undefined;
                                    } else if (newCollege[key]) {
                                        oldCollege[key] = newCollege[key];
                                    }
                                }
                            });
                            oldCollege.save(err => {
                                if (err) {
                                    if (err.code === 11000) {
                                        return callback(null);
                                    }
                                    console.log('we got a validation error', err);
                                    return callback(err);
                                }
                                return callback(null);
                            });
                        }
                    });
                },
                err => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(true);
                }
            );
        });

        fs
            .createReadStream(fileName)
            .pipe(parser)
            .pipe(transformer);
    });
}

function mapValues(line) {
    return line.map(key => {
        const obj = collegeKeys.find(field => {
            return field.fieldName === key;
        });
        if (obj) {
            return obj.dbName;
        }
        return key;
    });
}
