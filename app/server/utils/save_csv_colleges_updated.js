import fs from 'fs';
import parse from 'csv-parse';
import transform from 'stream-transform';
import async from 'async';
import mongoose from 'mongoose';

import College from '../models/college';
import { reference } from '../helpers/collegeKeys';

export default function(fileName) {

  return new Promise((resolve, reject) => {

    var parser = parse({
      delimiter: ',',
      columns: mapValues,
      auto_parse: true
    });

    var transformer = transform(function(record) {

      // console.log(record);
      // let years =  {};
      // years[2012] = record['2012 Enrolled Fall1'];
      // years[2013] = record['2013 Enrolled Fall 1'];
      // years[2014] = record['2014 Enrolled Fall 1'];
      // years[2015] = record['2015 Enrolled Fall 1 '];
      
      // record.enrollmentYears = years;

      console.log(record);

      return record;

    }, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }

      // reduce data size for testing
      // data = data.splice(0, 10);
      let addedCount = 0;
      let modifiedCount = 0;
      let newColleges = [];
      let updatedColleges = [];

      async.eachLimit(data, 10, (record, callback) => {

        // college.update({
        //   fullName: record.fullName
        // }, record, {
        //   upsert: true,
        //   setDefaultsOnInsert: true
        // }, (err, rawResponse) => {
        //   if (err) {
        //     callback(err);
        //     return;
        //   }

        //   if (rawResponse.upserted) {
        //     addedCount += 1;
        //   } else {
        //     modifiedCount += 1;
        //   }

        //   // console.log(rawResponse);
        //   callback(null);

        // });

        College.findOne({
          fullName: record.fullName
        }, (err, doc) => {

          // if doesnt exist - create new record  
          if (!doc) {
            var college = new College(record);
            college.save((err, doc) => {
              if (err) {
                callback(err);
                return;
              }
              addedCount++;
              newColleges.push({fullName: record.fullName});
              callback(null);
            });
          } else {
            modifiedCount++;
            console.log('the record exists already mate!'.red)
            updatedColleges.push({fullName: record.fullName})
            // run some logic of updating

            // update document with rules from Molly
            // options: overwrite / add
            
            
            

            callback(null);
          }

        });




      }, (err) => {

        if (err) {
          reject(err);
          return;
        }
        resolve({
          modifiedCount,
          addedCount
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