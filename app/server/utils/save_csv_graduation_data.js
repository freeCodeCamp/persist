import fs from 'fs';
import parse from 'csv-parse';
import transform from 'stream-transform';
import async from 'async'
import winston from 'winston';
import _ from 'lodash';

import Student from '../models/student';
import {collegeGraduationKeys} from '../../common/fieldKeys';
import formatRecord from './graduation_record_transformer';

const mapValues = (line) => {
    return line.map((key) => {
        const obj = collegeGraduationKeys.find((field) => {
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
        const data = {};
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
            console.log(err.message);
        });

        transformer.on('end', () => {
            if (error) return reject(error);
            async.eachLimit(data, 10, (graduations, callback) => {
                if (!graduations || graduations.length < 1) {
                    callback(null);
                    return;
                }
                const osis = graduations[0].osis;
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
                        let studentGraduations = student.graduations;
                        graduations.forEach((graduationRecord) => {
                            let graduation = studentGraduations
                                .find((elem) => {
                                    return elem.type === graduationRecord.type;
                                });
                            if (graduation) {
                                _.merge(graduation, graduationRecord);
                            } else {
                                studentGraduations.push(graduationRecord);
                            }
                        });
                        studentGraduations = studentGraduations.filter((obj) =>
                            (!_.isEmpty(obj))
                        );
                        studentGraduations = _.sortBy(studentGraduations, (obj) => {
                            return obj.enrolBegin;
                        }).reverse();
                        student.graduations = studentGraduations;
                        // for now, lets just overwrite the doc
                        student.save((err, updatedStudent) => {
                            if (err) {
                                console.log('error', studentGraduations, student);
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
