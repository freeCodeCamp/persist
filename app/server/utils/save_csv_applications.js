import fs from 'fs';
import parse from 'csv-parse';
import transform from 'stream-transform';
import async from 'async'
import winston from 'winston';
import _ from 'lodash';

import Student from '../models/student';
import {applicationKeys} from '../../common/fieldKeys';
import formatRecord from './application_record_transformer';

const mapValues = (line) => {
    return line.map((key) => {
        const obj = applicationKeys.find((field) => {
            return field.fieldName === key;
        });
        if (obj) {
            return obj.dbName;
        }
        return null;
    });
};

export default (fileName) => {
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
            while (row = transformer.read()) {
                data[row.osis] = data[row.osis] || [];
                data[row.osis].push(row);
            }
        });
        let error;
        transformer.on('error', (err) => {
            error = err;
            console.log(err.message, 'error');
        });

        transformer.on('end', () => {
            if (error) return reject(error);
            async.eachLimit(data, 10, (applications, callback) => {
                if (!applications || applications.length < 1) {
                    callback(null);
                    return;
                }
                const osis = applications[0].osis;
                // find student record
                // if exists - only then proceed
                Student.findOne({
                    osis
                }, (err, student) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    if (student) {
                        let studentApplications = student.applications;
                        applications.forEach((applicationRecord) => {
                            let application = studentApplications.find((elem) => {
                                return elem.college.toString() === applicationRecord.college.toString();
                            });
                            if (application) {
                                _.merge(application, applicationRecord);
                            } else {
                                studentApplications.push(applicationRecord);
                            }
                        });
                        studentApplications = studentApplications.filter((obj) =>
                            (!_.isEmpty(obj))
                        );
                        studentApplications = _.sortBy(studentApplications, (obj) => {
                            return obj.enrolBegin;
                        }).reverse();
                        student.applications = studentApplications;
                        // for now, lets just overwrite the doc
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
                });
            }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });

        fs.createReadStream(fileName).pipe(parser).pipe(transformer);
    });
}
