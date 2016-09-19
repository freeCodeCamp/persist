var fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');
var async = require('async');
var mongoose = require('mongoose');
var Student = require('./app/server/models/student')

mongoose.connect('mongodb://localhost:27017/nyc_outward');

var parser = parse({delimter: ','});


var Converter=require("csvtojson").Converter;
var csvConverter=new Converter({});


csvConverter.preProcessLine=function(line,lineNumber){
    //only change 12 to 23 for line 2 
    if (lineNumber === 1){
      line='text'
    }
    return line;
}

csvConverter.on("end_parsed", function (jsonArray) {
   console.log(jsonArray); //here is your result jsonarray 
});


// var parser = parse({delimiter: ',', columns: true, auto_parse: true}, function(err, parsed) {

// 	parsed = parsed.splice(0, 20);

// 	async.eachLimit(parsed, 1000, function(record, callback) {

// 		let newStudent = new Student();


// 		//map values
// 		record = mapValues(record);
// 		// console.log("mapped values on original record", record);
// 		//assign values
// 		for (let property in record) {
// 		    if (record.hasOwnProperty(property)) {
// 		        newStudent[property] = record[property];
// 		    }
// 		}

// 		// save to mongodb

// 		newStudent.save(function(err, data) {
            
//             if (err) { return callback(err); }
//             //console.log(data);
//             callback(null);

//         });

// 	}, function(err) {
// 		if (err) { console.log('something bad happened'); }
// 		else { console.log('we did it'); }
// 	});
// });

fs.createReadStream('data.csv').pipe(csvConverter);


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
		'Last Modified Date': 'lastModifiedDate'
	}

	let obj = {};

	for (let property in object) {
	    if (object.hasOwnProperty(property)) {
	        
	        obj[key[property]] = object[property];
	    }
	}

	return obj;

}