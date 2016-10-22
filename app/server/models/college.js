const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const College = new Schema({

	officialCollegeName: String,
	shortName: String,
	navianceName: String,
	collegeScorecardName: String,
	testingPolicy: String,
	barronsRating: String,
	avgHsGpa: Number,
	percentFirstGen: Number,
	percentPellGrant: Number,
	freshRetRate: Number,
	gradRate: { white: Number, black: Number, hispanic: Number, overall: Number },
	collType: String,
	highestDegGranted: String,
	predominentDegGranted: String,
	city: String,
	state: String,
	zipcode: String,
	website: String,
	locale: String,
	netPriceCalculator: String,
	percentNeedMet: Number,
	studentsEnrolledAfterGrad: Number,
	importantContacts: String,
	specialPrograms: String,
	specialProgramsNotes: String,
	otherNotes: String,
	region: String,
	hbcu: String,
	religiousAffiliation: String,
	admissionsRate: Number,
	percentileCrR25: Number,
	percentileCR75: Number,
	percentileMath25: Number,
	percentileMath75: Number,
	numberStudents: Number,
	fullTimeEnrolledPercentage: Number,
	netPrice0to30: Number,
	netPrice30to48: Number,
	netPrice48to75: Number

});

module.exports = mongoose.model('College', College);


// unused at present
	// medSatMath: Number,
	// medSatCr: Number,
	// locale: String,
	// enrollmentYears: {}