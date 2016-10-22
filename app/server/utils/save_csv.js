import fs from 'fs';
import parse from 'csv-parse';
import transform from 'stream-transform';
import async from 'async';

// this is the data we need for validation and transforming
import Student from '../models/student';
import { reference } from '../helpers/key';
import formatRecord from './student_record_transformer';

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
    var data = [];
    var row;
    var i = 0;
    transformer.on('readable', function() {
      while (row = transformer.read()) {
        console.log(i++);
        data.push(row);
      }
    });

    transformer.on('error', function(err) {
      console.log(err.message);
      reject(err);
    });

    transformer.on('end', function() {
      console.log('end');

      // reduce data size for testing
      // data = data.splice(0, 10);
      let addedCount = 0;
      let modifiedCount = 0;
      let newStudents = [];
      let updatedStudents = [];

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
                callback(err);
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
            modifiedCount++;
            console.log('the record exists already mate!'.red);
            updatedStudents.push({
              osis: record.osis,
              firstName: record.firstName,
              lastName: record.lastName
            });
            // run some logic of updating

            // update document with rules from Molly
            // options: overwrite / add

            callback(null);
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
          updatedStudents
        });
      });
    });

    fs.createReadStream(fileName).pipe(parser).pipe(transformer);

  });
}


function mapValues(line) {

  return line.map((key) => {
    var obj = reference.find((field) => {
      return field.fieldName === key;
    });
    if (obj) {
      return obj.dbName;
    }
    return key;
  });
}