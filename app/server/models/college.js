const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const College = new Schema({

	fullName: String,
	shortName: String,
	navianceName: String,
	collRepCardName: String,
	testPolicy: String,
	barRating: String,
	avgHsGpa: Number,
	medSatMath: Number,
	medSatCr: Number,
	firstGen: Number,
	pellGrantRec: Number,
	freshRetRate: Number,
	gradRate: { white: Number, black: Number, hispanic: Number, overall: Number },
	collType: String,
	highestDegGranted: String,
	predominentDegGranted: String,
	city: String,
	state: String,
	website: String,
	locale: String,
	needMet: Number,
	impContacts: Number,
	specialPrograms: String,
	notesPrograms: String,
	otherNotes: String,
	enrollmentYears: {}
});

module.exports = mongoose.model('College', College);
