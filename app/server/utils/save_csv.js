import fs from 'fs';
import parse from 'csv-parse';
import merge from 'lodash/merge';
import transform from 'stream-transform';
import async from 'async';

// this is the data we need for validation and transforming
import Student from '../models/student';
import {studentKeys} from '../../common/fieldKeys';
import formatRecord from './student_record_transformer';

export default function (fileName) {

    return new Promise((resolve, reject) => {

        var parser = parse({
            delimiter: ',',
            columns: mapValues,
            auto_parse: true
        });

        var transformer = transform(formatRecord, {
            parallel: 20
        });
        var data = [];
        var row;
        transformer.on('readable', function () {
            while (row = transformer.read()) {
                data.push(row);
            }
        });

        let error;

        transformer.on('error', function (err) {
            error = err;
            console.log(err.message);
        });

        transformer.on('end', function () {
            if (error) return reject(error);
            // reduce data size for testing
            // data = data.splice(0, 1);
            let addedCount = 0;
            let modifiedCount = 0;
            let newStudents = [];
            let updatedStudents = [];
            let errorStudents = [];
            let errorCount = 0;
            console.time('dbSave');

            async.eachLimit(data, 10, (record, callback) => {
                Student.findOne(
                    {osis: record.osis},
                    (err, oldStudent) => {
                        if (err) {
                            console.log('error in finding document', err);
                            return callback(err);
                        }
                        if (!oldStudent) {
                            const newStudent = new Student(record);
                            newStudent.save((err) => {
                                if (err) {
                                    console.log('we got a validation error', err);
                                    return callback(err);
                                }
                                return callback(null);
                            });
                        } else {
                            const newStudent = merge(oldStudent, record);
                            newStudent.save((err) => {
                                if (err) {
                                    console.log('we got a validation error', err);
                                    return callback(err);
                                }
                                return callback(null);
                            })
                        }
                    });
            }, (err) => {
                console.log('getting through to here'.blue);
                if (err) {
                    reject(err);
                    return;
                }
                console.timeEnd('dbSave');
                resolve({
                    modifiedCount,
                    addedCount,
                    newStudents,
                    updatedStudents,
                    errorStudents,
                    errorCount
                });
            });
        });

        fs.createReadStream(fileName).pipe(parser).pipe(transformer);

    });
}


function mapValues(line) {

    return line.map((key) => {
        var obj = studentKeys.find((field) => {
            return field.fieldName === key;
        });
        if (obj) {
            return obj.dbName;
        }
        return key;
    });
}