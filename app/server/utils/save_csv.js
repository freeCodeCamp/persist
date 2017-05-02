import fs from 'fs';
import parse from 'csv-parse';
import set from 'lodash/set';
import forOwn from 'lodash/forOwn';
import clone from 'lodash/clone';
import isEqual from 'lodash/isEqual';
import transform from 'stream-transform';
import async from 'async';

// this is the data we need for validation and transforming
import Student from '../models/student';
import { studentKeys } from '../../common/fieldKeys';
import formatRecord from './student_record_transformer';
import myMerge from '../helpers/merge';

const createAlias = student => ({
    firstName: student.firstName,
    middleName: student.middleName,
    lastName: student.lastName,
    suffix: student.suffix
});

export default function(fileName) {
    return new Promise((resolve, reject) => {
        var parser = parse({
            delimiter: ',',
            columns: mapValues,
            auto_parse: true
        });

        var transformer = transform(formatRecord, {
            parallel: 20
        });
        const data = {};
        let row;
        transformer.on('readable', () => {
            while ((row = transformer.read())) {
                data[row.osis] = data[row.osis] || clone({});
                data[row.osis] = myMerge(data[row.osis], row);
            }
        });

        let error;

        transformer.on('error', function(err) {
            error = err;
            console.log(err.message);
        });

        transformer.on('end', function() {
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

            async.eachLimit(
                data,
                10,
                (record, callback) => {
                    Student.findOne({ osis: record.osis }, (err, oldStudent) => {
                        if (err) {
                            console.log('error in finding document', err);
                            return callback(err);
                        }
                        if (!oldStudent && !record.alias) {
                            const newStudent = new Student(record);
                            newStudent.save(err => {
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
                            if (record.alias) {
                                const oldAlias = oldStudent.aliases.find(alias => isEqual(alias, createAlias(record)));
                                if (!oldAlias) {
                                    oldStudent.aliases.push(createAlias(record));
                                }
                            } else {
                                const newRecord = {};
                                forOwn(record, (value, key) => {
                                    set(newRecord, key, value);
                                });
                                const studentObject = oldStudent.toObject();
                                const newStudent = myMerge(studentObject, newRecord);
                                forOwn(studentObject, (value, key) => {
                                    if (key !== '_id') {
                                        if (newStudent[key] === 'set undefined') {
                                            oldStudent[key] = undefined;
                                        } else if (newStudent[key]) {
                                            oldStudent[key] = newStudent[key];
                                        }
                                    }
                                });
                            }
                            oldStudent.save(err => {
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
                },
                err => {
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
                }
            );
        });

        fs.createReadStream(fileName).pipe(parser).pipe(transformer);
    });
}

function mapValues(line) {
    return line.map(key => {
        var obj = studentKeys.find(field => {
            return field.fieldName === key;
        });
        if (obj) {
            return obj.dbName;
        }
        return key;
    });
}
