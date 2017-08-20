import fs from 'fs';
import parse from 'csv-parse';
import { set, forOwn, clone, isEqual, uniqWith } from 'lodash';
import transform from 'stream-transform';
import async from 'async';

// this is the data we need for validation and transforming
import { setUndefined } from '../helpers';
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
        data[row.osis] = data[row.osis] || clone({});
        data[row.osis] = myMerge(data[row.osis], row);
      }
    });

    const error = [];

    transformer.on('error', err => {
      error.push(err);
      console.log(err.message);
    });

    transformer.on('end', function() {
      if (error.length > 0) { return reject(uniqWith(error, isEqual)); }
      // reduce data size for testing
      // data = data.splice(0, 1);
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
              setUndefined(record);
              const newStudent = new Student(record);
              newStudent.save(err => {
                if (err) {
                  if (err.code === 11000) {
                    return callback(null);
                  }
                  console.log('we got a validation error', err);
                  return callback(err);
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
                  return callback(err);
                }
                return callback(null);
              });
            }
          });
        },
        err => {
          if (err) {
            reject(err);
            return;
          }
          console.timeEnd('dbSave');
          resolve(true);
        }
      );
    });

    fs.createReadStream(fileName)
      .pipe(parser)
      .pipe(transformer);
  });
}

function mapValues(line) {
  return line.map(key => {
    const obj = studentKeys.find(field => {
      return field.fieldName === key;
    });
    if (obj) {
      return obj.dbName;
    }
    return key;
  });
}