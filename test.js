// var fs = require('fs');
// var parse = require('csv-parse');
// var transform = require('stream-transform');
// var async = require('async');
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/nyc_outward');

// Create the parser


// var parser = parse({delimiter: ','}, function(err, parsed) {
// 	console.log(parsed[0]);
// });

// fs.createReadStream('./data/NSC_file_download.csv').pipe(parser);


// Converter Class 
// var Converter = require("csvtojson").Converter;
// var converter = new Converter({});
 
// //end_parsed will be emitted once parsing finished 
// converter.on("end_parsed", function (jsonArray) {
//    console.log(jsonArray); //here is your result jsonarray 
// });
 
// //read from file 
// require("fs").createReadStream("./data.csv").pipe(converter);

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nyc_outward');
const csvProcessor = require("./app/server/utils/csv_json").csvConvertAsync;

csvProcessor('./data.csv').then(function(data) {
	console.log(data);
}).catch(function(err) {
	console.log(err);
});

// const saveSingle = require("./app/server/utils/csv_json").saveSingleRecord;

// saveSingle({"firstName": "Sachin", "lastName": "Mour"});


