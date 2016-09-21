import fs from 'fs';


const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const parse = require('csv-parse');
const transform = require('stream-transform');
const async = require('async');
const Student = require('../models/student');



module.exports =  {

	csvConvert: function(file) {

		return new Promise((resolve, reject) => {

				//if not csv, return
				if (path.extname(file) !== '.csv') {
					reject('Not a valid CSV file.');
				}

				// options for parser
				const parserOptions = {delimiter: ',', columns: true, auto_parse: true, auto_parse_date: true};

				// parse csv
				const parser = parse(parserOptions, function(err, parsed) {

					if (err) { reject(err); }

					// data manipulation
					parsed = parsed.splice(0, 100);

					// add to mongodb
					Student.collection.insert(parsed, {}, (err, data) => {
						if (err) { reject(err); };
						resolve(data);
					});
				});

				// read csv and parse
				fs.createReadStream(file).pipe(parser);


			});	
	},

	csvConvertAsync: function(file) {

		return new Promise((resolve, reject) => {

			var parser = parse({delimiter: ',', columns: true, auto_parse: true}, function(err, parsed) {

			//parsed = parsed.splice(0, 1000);

			async.eachLimit(parsed, 1000, function(record, callback) {

				let newStudent = new Student();

				record = mapValues(record);
				
				for (let property in record) {
					if (record.hasOwnProperty(property)) {
					newStudent[property] = record[property];
					}
				}

				// save to mongodb
				newStudent.save(function(err, data) {

					if (err) { return callback(err); }

					callback(null);

				});

				}, function(err) {
					if (err) { reject('something bad happened'); }
					else { resolve('we did it'); }
				});
			});

			fs.createReadStream('data.csv').pipe(parser);

    	});

	}

};



function mapValues(object) {

	const key = {
		'First Name': 'firstName',
		'Last Name': 'lastName',
		'High School Graduation Year': 'hsGradYear',
		'Student Tags': 'tags',
		EducationalHistoryNumber: 'edHistNo',
		'Record Type (h)': 'recType',
		'School: Account Name': 'schoolAccName',
		'School Type': 'schoolType',
		'Term Enrollment Status': 'enrollmentStatus',
		'Term Name (h)': 'termName',
		'Term Start Date': 'termStartDate',
		'Term End Date': 'termEndDate',
		'Term GPA': 'termGPA',
		'Cumulative GPA': 'cumulativeGPA',
		'Total Credit Hours Attempted': 'creditHoursAttempted',
		'Total Credit Hours towards Grad Earned': 'creditHoursGradEarned',
		'Total Remedial Credit Hours Earned': 'remedialHoursEarned',
		'Term ID': 'termID',
		'Educational History ID': 'educationalHistory',
		'Contact Id (18 Char)': 'contactID',
		'Last Modified By: Full Name': 'lastModifiedBy',
		'Last Modified Date': 'lastModifiedDate',
		'High School Student ID': 'hsID',
		'Middle Name': 'middleName'
	}

	let obj = {};

	for (let property in object) {
	    if (object.hasOwnProperty(property)) {
	        
	        obj[key[property]] = object[property];
	    }
	}

	return obj;

}
