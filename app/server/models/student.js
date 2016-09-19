const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Parent = {
	relationship: String,
	name: String,
	mobile: Number,
	textable: Boolean,
	workPhone: Number,
	OtherPhone: [Number]
};

const Student = new Schema({

	firstName: String,
	lastName: String,
	hsGradYear: Number,
	tags: [String],
	edHistNo: String,
	recType: String,
	schoolAccName: String,
	schoolType: String,
	enrollmentStatus: String,
	termName: String,
	termStartDate: Date,
	termEndDate: Date,
	termGPA: Number,
	cumulativeGPA: Number,
	creditHoursAttempted: Number,
	creditHoursGradEarned: Number,
	remedialHoursEarned: Number,
	termID: String,
	educationalHistory: String,
	contactID: { type: String, index: true },
	dob: Date,
	mobile: Number,
	textable: Boolean,
	homePhone: Number,
	otherPhone: [Number],
	email: String,
	lastModifiedDate: Date,
	lastModifiedBy: String,
	parentGuardian: [Parent]
});

module.exports = mongoose.model('Student', Student);
