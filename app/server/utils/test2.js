import fs from 'fs';
import parse from 'csv-parse';
import transform from 'stream-transform';
import async from 'async';
import mongoose from 'mongoose';
import Student from '../models/student';

//mongoose.connect('mongodb://localhost:27017/nyc_outward');


export default function() {

	return new Promise((resolve, reject) => {

		var parser = parse({delimiter: ',', columns: mapValues, auto_parse: true });

		var transformer = transform(function(record) {

			record.lastModifiedDate = new Date(record.lastModifiedDate);
			record.termStartDate = new Date(record.termStartDate);
			record.termEndDate = new Date(record.termEndDate);
			record.tags = record.tags.split(/\s+/);
			return record;

		}, (err, data) => {

			if (err) {
				console.log(err);
				return;
			}

			async.eachLimit(data, 10, (record, callback) => {

				Student.update({contactID: record.contactID}, record, { upsert: true, setDefaultsOnInsert: true }, (err, rawResponse) => {
					if (err) {
						callback(err);
						return;
					}
					console.log(rawResponse);
					callback(null);
				});

			}, (err) => {

				if (err) {
					reject(err);
					return;
				}

				resolve('we succeeded');

			});

		});

		fs.createReadStream('data2.csv').pipe(parser).pipe(transformer);

	});

}

function mapValues(line) {

			const convert = {
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
				'Last Modified Date': 'lastModifiedDate'
			};

			return line.map((key) => convert[key]);
		};