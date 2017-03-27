import fs from 'fs';
import parse from 'csv-parse';
import csv from 'csv';
import transform from 'stream-transform';
import async from 'async';
import set from 'lodash/set';
import clone from 'lodash/clone';
import myMerge from '../helpers/merge';
import isFinite from 'lodash/isFinite';
import forOwn from 'lodash/forOwn';
import College from '../models/college';
import {collegeKeys} from '../../common/fieldKeys';

export default function(fileName) {

    return new Promise((resolve, reject) => {

        var parser = parse({
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
            while (row = transformer.read()) {
                const uniqueName = `${row.fullName || ''}${row.navianceName || ''}${row.shortName || ''}${row.collegeScorecardName || ''}`;
                data[uniqueName] = data[uniqueName] || clone({});
                data[uniqueName] = myMerge(data[uniqueName], row);
            }
        });

        let error;
        transformer.on('error', function(err) {
            error = err;
            console.log(err.message);
        });

        transformer.on('end', () => {
            async.eachLimit(data, 10, (record, callback) => {

                College.findOne({
                    $or: [
                        { fullName: record.fullName },
                        { shortName: record.shortName },
                        { navianceName: record.navianceName },
                        { collegeScorecardName: record.collegeScorecardName }
                    ]
                }, (err, oldCollege) => {
                    console.log(oldCollege, 'oldCollege');
                    if (err) {
                        console.log('error in finding document', err);
                        return callback(err);
                    }
                    if (!oldCollege) {
                        const college = new College(record);
                        college.save((err) => {
                            if (err) {
                                if (err.code === 11000) {
                                    return callback(null);
                                }
                                console.log('we got a validation error', err);
                                return callback(null);
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
                            if (key !== '_id' && newCollege[key]) {
                                oldCollege[key] = newCollege[key];
                            }
                        });
                        oldCollege.save((err) => {
                            if (err) {
                                if (err.code === 11000) {
                                    return callback(null);
                                }
                                console.log('we got a validation error', err);
                                return callback(null);
                            }
                            return callback(null);
                        });
                    }

                });


            }, (err) => {

                if (err) {
                    reject(err);
                    return;
                }
                resolve({});
            });
        });

        fs.createReadStream(fileName).pipe(parser).pipe(transformer);

    });
}

function mapValues(line) {

    return line.map((key) => {
        var obj = collegeKeys.find((field) => {
            return field.fieldName === key;
        });
        if (obj) {
            return obj.dbName;
        }
        return key;
    });
}