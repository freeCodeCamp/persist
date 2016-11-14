import fs from 'fs';
import parse from 'csv-parse';
import transform from 'stream-transform';
import async from 'async'
import winston from 'winston';
import _ from 'lodash';

import Student from '../models/student';
import termKeys from '../helpers/termKeys';
import formatRecord from './term_record_transformer';

const mapValues = (line) => {
    return line.map((key) => {
        var obj = termKeys.find((field) => {
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
        const data = [];
        let row;
        transformer.on('readable', () => {
            while (row = transformer.read()) {
                data.push(row);
            }
        });

        transformer.on('error', (err) => {
            console.log(err.message);
            reject(err);
        });

        transformer.on('end', () => {
            const termsAdded = [];
            // async limit is 1 as same terms are being updated by multiple queries resolving
            // to versioning issue.
            async.eachLimit(data, 1, (record, callback) => {
                delete record['null'];
                // find student record
                // if exists - only then proceed
                Student.findOne({
                    osis: record.osis
                }, (err, student) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    if (student) {
                        let terms = student.terms;
                        let term = terms.find((elem) => {
                            return elem.name === record.name;
                        });
                        if (term) {
                            _.merge(term, record);
                        } else {
                            terms.push(record);
                        }
                        terms = terms.filter((obj) =>
                            (!_.isEmpty(obj))
                        );
                        terms = _.sortBy(terms, (obj) => {
                            return obj.enrolBegin;
                        }).reverse();
                        student.terms = terms;
                        // for now, lets just overwrite the doc
                        student.save((err, updatedStudent) => {
                            if (err) {
                                console.log('error', record, student);
                                callback(err);
                            } else {
                                termsAdded.push(record);
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
                resolve({termsAdded});
            });
        });

        fs.createReadStream(fileName).pipe(parser).pipe(transformer);
    });
}
