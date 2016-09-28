const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const School = new Schema({
  name: String
});

module.exports = mongoose.model('School', School);
