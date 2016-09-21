import fs from 'fs';
import parse from 'csv-parse';
import transform from 'stream-transform';
import async from 'async';
import mongoose from 'mongoose';
import Student from '../models/student';

function checkDate(date) {
			if (date.toString() == 'Invalid Date') {
				return false;
			}
			else {
				return true;
			}
		}

export default function(fileName) {

	return new Promise((resolve, reject) => {

		var parser = parse({delimiter: ',', columns: mapValues, auto_parse: true });

		var transformer = transform(function(record) {


				// if (record.contactID && record.contactID.length < 10) {
				// 	return;
				// }


				// record.lastModifiedDate = new Date(record.lastModifiedDate);
				// record.termStartDate = new Date(record.termStartDate);
				// record.termEndDate = new Date(record.termEndDate);

				// if (record.tags) {
				// 	record.tags = record.tags.split(/\s+/);
				// }
				

				// if (!checkDate(record.lastModifiedDate) && !checkDate(record.termStartDate) && !checkDate(record.termEndDate)) {
				// 	console.log(record);
				// 	return;
				// }
				
				console.log(record);
				let terms = [];

				for (let i = 1; i <= 8; i++) {
					terms[i-1] = {};
					terms[i-1].name = record['Term' + i];
					terms[i-1].status = record['Status' + i];
					terms[i-1].college = record['College' + i];
					terms[i-1].recordType = record['Record Type' + i];
				}


				record.terms = terms;
				
				// record.terms = [];

				// for (var i = 0; i < 8; i++) {
				// 	record.terms.push({});
				// }

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

			async.eachLimit(data, 10, (record, callback) => {

					Student.update({contactID: record.contactID}, record, { upsert: true, setDefaultsOnInsert: true }, (err, rawResponse) => {
						if (err) {
							callback(err);
							return;
						}

						if (rawResponse.upserted) {
							addedCount += 1;
						} else {
							modifiedCount += 1;
						}

						console.log(rawResponse);
						callback(null);

					});

			}, (err) => {

				if (err) {
					reject(err);
					return;
				}
				resolve({ modifiedCount, addedCount });
			});
		});

		fs.createReadStream(fileName).pipe(parser).pipe(transformer);

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

				'Contact ID': 'contactID',

				'Last Modified By: Full Name': 'lastModifiedBy',

				'Last Modified Date': 'lastModifiedDate',

				'High School Student ID': 'hsID',

				'Middle Name': 'middleName',

				'Suffix': 'suffix',

				'Alternative Name/ Spelling': 'altName',

				'Birthdate': 'dob',

				'High School Attended': 'hsAttended',

				'Cellphone': 'cellPhone',

				'Other Phone': 'otherPhone',

				'Email 1': 'email1',

				'Email2': 'email2',

				'Parent Name': 'parentName',

				'Parent Contact': 'parentContact',

				'Most Recent College or Employer': 'mostRecentColEmp',

				'Major/Minor': 'majorMinor',
 
				'Transfer Status': 'transferStatus',

				'Name of Student Support Org': 'studentSupportOrgName',

				'Notes': 'notes',

				'Needs Followup?': 'needsFollowup',

				'Cohort': 'cohort',	 

				'HS Grad Date': 'hsGradDate',

				'Initial Enrollment Date': 'initEnrollmentDate',	

				'Race/Ethnicity': 'raceEthnicity',	

				'Gender': 'gender',

				'Student Tags': 'tags',

				'Intended College': 'intendedCollege',

				'SAT Math': 'SAT.math',

				'SAT CR': 'SAT.cr',	

				'ACT Equiv': 'ACTEquiv',

				'HS GPA': 'hsGPA'
		
			};

			return line.map((key) => {
				if (key in convert) {
					return convert[key];
				}
				return key;
			});

		};