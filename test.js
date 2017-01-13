var json2csv = require('json2csv');
var fs = require('fs');
var fields = ['carModel', 'price', 'colors'];
var myCars = [
    {
        "carModel": "Audi",
        "price": 0,
        "colors": [{check: 1, check2: 2},{check3: 3, check4: 4}]
    }, {
        "carModel": "BMW",
        "price": 15000,
        "colors": [{check2: 2, check3: 3},{check1: 1, check4: 4}]
    }, {
        "carModel": "Mercedes",
        "price": 20000,
        "colors": "yellow"
    }, {
        "carModel": "Porsche",
        "price": 30000,
        "colors": ["green","teal","aqua"]
    }
];
var csv = json2csv({ data: myCars, fields: fields, unwindPath: 'colors' });

fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
});