import fs from 'fs';
import parse from 'csv-parse';
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

                // find student record

                // if exists - modify values in a set way for each value

                Student.findOne({
                    osis: record.osis
                }, (err, doc) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    // if doesnt exist - create new record
                    if (!doc) {
                        var student = new Student(record);
                        student.save((err, doc) => {
                            if (err) {
                                console.log(doc, 'doc');
                                console.log(student, 'student');
                                console.log('WE GOT A VALIDATION ERROR', err);
                                errorStudents.push({
                                    osis: record.osis,
                                    firstName: record.firstName,
                                    lastName: record.lastName,
                                    err
                                });
                                errorCount++
                                callback(null);
                                return;
                            }
                            addedCount++;
                            newStudents.push({
                                osis: doc.osis,
                                firstName: doc.firstName,
                                lastName: doc.lastName
                            });
                            callback(null);
                        });
                    } else {

                        // there should be custom updating here
                        // // console.log(doc);

                        // const addWithComma = ['email', 'parentName', 'parentPhone', 'degreeTitle', 'gradDate', 'preferredLanguage', 'hsc'];
                        // const add = ['otherPhone', 'studentTags', 'transStatus', 'remediationStatus', 'riskFactors', 'employmentStatus'];
                        // const overWriteIfHigher = ['act', 'SAT.math', 'SAT.cr'];

                        // addWithComma.forEach((field) => {
                        //   if (doc[field]) {
                        //     doc[field] = doc[field] + ', ' + record[field];
                        //   }

                        // });

                        // for now, lets just overwrite the doc
                        doc.save(function (err, updatedDoc) {
                            if (err) {
                                console.log('WE GOT A VALIDATION ERROR', err);
                                errorStudents.push({
                                    osis: record.osis,
                                    firstName: record.firstName,
                                    lastName: record.lastName,
                                    err
                                });
                                errorCount++
                                callback(null);

                            } else {
                                console.log('we updated the doc!', updatedDoc);
                                modifiedCount++;
                                updatedStudents.push({
                                    osis: record.osis,
                                    firstName: record.firstName,
                                    lastName: record.lastName
                                });
                                callback(null);
                            }

                        });

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