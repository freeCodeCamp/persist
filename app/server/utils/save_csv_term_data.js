import fs from 'fs';
import parse from 'csv-parse';
import moment from 'moment';
import transform from 'stream-transform';
import async from 'async';
import _ from 'lodash';
import Student from '../models/student';
import { termKeys } from '../../common/fieldKeys';
import formatRecord from './term_record_transformer';

const mapValues = line => {
    return line.map(key => {
        var obj = termKeys.find(field => {
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
        const data = {};
        let row;
        transformer.on('readable', () => {
            while ((row = transformer.read())) {
                data[row.osis] = data[row.osis] || _.clone([]);
                data[row.osis].push(row);
            }
        });
        let error;
        transformer.on('error', err => {
            error = err;
            console.log(err.message);
        });

        transformer.on('end', () => {
            if (error) return reject(error);
            async.eachLimit(
                data,
                10,
                (terms, callback) => {
                    if (!terms || terms.length < 1) {
                        callback(null);
                        return;
                    }
                    const osis = terms[0].osis;
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
                                let studentTerms = student.terms;
                                terms.forEach(termRecord => {
                                    let term = studentTerms.find(elem => {
                                        const overlap = (elem.enrolBegin <= termRecord.enrolBegin &&
                                            elem.enrolEnd >= termRecord.enrolBegin) ||
                                            (elem.enrolBegin <= termRecord.enrolEnd && elem.enrolEnd >= termRecord.enrolEnd);
                                        if (overlap) {
                                            let overlapStart, overlapEnd;
                                            if (moment(elem.enrolBegin).diff(moment(termRecord.enrolBegin), 'days') >= 0) {
                                                overlapStart = elem.enrolBegin;
                                            } else if (moment(elem.enrolEnd).diff(moment(termRecord.enrolBegin), 'days') >= 0) {
                                                overlapStart = termRecord.enrolBegin;
                                            }
                                            overlapEnd = moment(termRecord.enrolEnd).diff(moment(elem.enrolEnd), 'days') >= 0
                                                ? elem.enrolEnd
                                                : termRecord.enrolEnd;
                                            if (overlapStart && overlapEnd) {
                                                const overlappingDays = moment(overlapEnd).diff(moment(overlapStart), 'days');
                                                const elemDays = moment(elem.enrolEnd).diff(moment(elem.enrolBegin), 'days');
                                                const termRecordDays = moment(termRecord.enrolEnd).diff(
                                                    moment(termRecord.enrolBegin),
                                                    'days'
                                                );
                                                if (overlappingDays / elemDays >= 0.85 && overlappingDays / termRecordDays >= 0.85) {
                                                    return true;
                                                }
                                            }
                                        }
                                        return false;
                                    });
                                    if (term) {
                                        _.merge(term, termRecord);
                                    } else {
                                        studentTerms.push(termRecord);
                                    }
                                });
                                studentTerms = studentTerms.filter(obj => !_.isEmpty(obj));
                                student.terms = studentTerms;
                                // for now, lets just overwrite the doc
                                student.save((err, updatedStudent) => {
                                    if (err) {
                                        console.log('error', err, studentTerms, student);
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
