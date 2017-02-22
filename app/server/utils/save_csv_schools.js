import fs from 'fs';
import parse from 'csv-parse';
import transform from 'stream-transform';
import async from 'async';
import {School} from '../models';
import {schoolKeys} from '../../common/fieldKeys';

const mapValues = (line) => {
    return line.map((key) => {
        const obj = schoolKeys.find((field) => {
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

        const transformer = transform(record => record,
            (err, data) => {
                if (err) {
                    return console.log(err);
                }

                async.eachLimit(data, 10, (record, callback) => {
                    School.findOne({
                        name: record.name
                    }, (err, oldSchool) => {
                        if (err) {
                            return callback(err);
                        }
                        // if doesnt exist - create new record
                        if (!oldSchool) {
                            const newSchool = new School(record);
                            newSchool.save((err) => {
                                if (err) {
                                    return callback(err);
                                }
                                callback(null);
                            });
                        }
                    });
                }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
            });

        fs.createReadStream(fileName).pipe(parser).pipe(transformer);

    });
}
