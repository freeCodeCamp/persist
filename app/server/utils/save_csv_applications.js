import fs from 'fs';
import parse from 'csv-parse';
import transform from 'stream-transform';
import async from 'async';
import { toString, merge, sortBy, isEmpty, clone, uniqWith, isEqual } from 'lodash';
import { setUndefined } from '../helpers';
import Student from '../models/student';
import { applicationKeys } from '../../common/fieldKeys';
import formatRecord from './application_record_transformer';

const mapValues = line => {
    return line.map(key => {
        const obj = applicationKeys.find(field => {
            return field.fieldName === key;
        });
        if (obj) {
            return obj.dbName;
        }
        return null;
    });
};

export default fileName => {
    return new Promise((resolve, reject) => {
        const parser = parse({
            delimiter: ',',
            columns: mapValues,
            auto_parse: true
        });

        const transformer = transform(formatRecord, {
            parallel: 20
        });
        let data = {};
        let row;
        transformer.on('readable', () => {
            while ((row = transformer.read())) {
                data[row.osis] = data[row.osis] || clone([]);
                data[row.osis].push(row);
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
                (applications, callback) => {
                    if (!applications || applications.length < 1) {
                        callback(null);
                        return;
                    }
                    const osis = applications[0].osis;
                    // find student record
                    // if exists - only then proceed
                    Student.findOne(
                        {
                            osis
                        },
                        (err, student) => {
                            if (err) {
                                callback(err);
                                return;
                            }
                            if (student) {
                                let studentApplications = student.applications;
                                applications.forEach(applicationRecord => {
                                    let application = studentApplications.find(elem => {
                                        return toString(elem.college) === toString(applicationRecord.college);
                                    });
                                    if (application) {
                                        merge(application, applicationRecord);
                                        setUndefined(application);
                                    } else {
                                        setUndefined(applicationRecord);
                                        studentApplications.push(applicationRecord);
                                    }
                                });
                                studentApplications = studentApplications.filter(obj => !isEmpty(obj));
                                studentApplications = sortBy(studentApplications, obj => {
                                    return obj.enrolBegin;
                                }).reverse();
                                student.applications = studentApplications;
                                student.save((err, updatedStudent) => {
                                    if (err) {
                                        console.log('error', studentApplications, student);
                                        callback(err);
                                    } else {
                                        callback(null);
                                    }
                                });
                            } else {
                                return callback(null);
                            }
                        }
                    );
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

        fs.createReadStream(fileName).pipe(parser).pipe(transformer);
    });
};
