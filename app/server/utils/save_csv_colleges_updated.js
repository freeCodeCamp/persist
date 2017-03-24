import fs from 'fs';
import parse from 'csv-parse';
import transform from 'stream-transform';
import async from 'async';
import merge from 'lodash/merge';
import isFinite from 'lodash/isFinite';
import forOwn from 'lodash/forOwn';
import mongoose from 'mongoose';

import College from '../models/college';
import {collegeKeys} from '../../common/fieldKeys';

export default function(fileName) {

    return new Promise((resolve, reject) => {

        var parser = parse({
            delimiter: ',',
            columns: mapValues,
            auto_parse: true
        });

        var transformer = transform(function(record) {

            forOwn(College.schema.obj, (value, key) => {
                if (value.name && value.name.toString() === 'Number') {
                    record[key] = Number(record[key]);
                    if (!isFinite(record[key])) {
                        delete record[key];
                    }
                }
            });
            return record;
        }, (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            // reduce data size for testing
            // data = data.splice(0, 10);
            let addedCount = 0;
            let modifiedCount = 0;
            let newColleges = [];
            let updatedColleges = [];

            async.eachLimit(data, 10, (record, callback) => {

                College.findOne({
                    fullName: record.fullName
                }, (err, oldCollege) => {

                    // if doesnt exist - create new record
                    if (!oldCollege) {
                        const college = new College(record);
                        college.save((err) => {
                            if (err) {
                                if (err.code === 11000) {
                                    return callback(null);
                                }
                                return callback(null);
                            }
                            return callback(null);
                        });
                    } else {
                        modifiedCount++;
                        const collegeObject = oldCollege.toObject();
                        const newCollege = merge(collegeObject, record);
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
                resolve({
                    modifiedCount,
                    addedCount
                });
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