'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Student = new Schema({}, { strict: false });

module.exports = mongoose.model('Student', Student);