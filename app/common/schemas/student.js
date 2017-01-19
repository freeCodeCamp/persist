import validator, {messages, enums} from '../validator';

const Parent = {
    relationship: String,
    name: String,
    mobile: Number,
    textable: Boolean,
    workPhone: Number,
    OtherPhone: [Number]
};

const termSchema = (Schema) => (
    new Schema({
        name: String,
        college: {
            type: Schema.Types.ObjectId,
            ref: 'College'
        },
        status: String,
        enrolBegin: Date,
        enrolEnd: Date,
        creditsEarned: Number,
        creditsAttempted: Number,
        gpa: Number
    })
);

const documentSchema = (Schema) => (
    new Schema({
        name: String,
        type: String,
        Key: String,
        downloadLink: String
    })
);

const caseNotesSchema = (Schema) => (
    new Schema({
        description: String,
        communicationType: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        date: Date,
        needFollowUp: {
            type: Boolean,
            default: false
        },
        issueResolved: {
            type: Boolean,
            default: false
        }
    })
);

const applicationsSchema = (Schema) => (
    new Schema({
        college: {
            type: Schema.Types.ObjectId,
            ref: 'College'
        },
        result: String,
        heop: String,
        attending: {
            type: Boolean,
            default: false
        },
        defer: {
            type: Boolean,
            default: false
        },
        notes: String
    })
);

const graduationsSchema = (Schema) => (
    new Schema({
        college: {
            type: Schema.Types.ObjectId,
            ref: 'College'
        },
        status: String,
        enrolBegin: Date,
        enrolEnd: Date,
        type: String
    })
);

export default (Schema) => {
    return {
        firstName: {
            type: String,
            index: true
        },
        lastName: String,
        middleName: String,
        fullName: String,
        suffix: String,
        altName: String,
        hsGradYear: Number,
        descriptors: {
            type: [String],
            validate: {
                validator: validator.descriptors,
                message: messages.default
            }
        },
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
        contactID: {
            type: String,
            index: true
        },
        dob: {
            type: Date
        },
        mobile: Number,
        textable: {
            type: Boolean,
            default: false
        },
        homePhone: Number,
        otherPhone: String,
        email: String,
        lastModifiedDate: Date,
        lastModifiedBy: String,
        parentGuardian: [Parent],
        hsID: Number,
        cellPhone: String,
        email1: String,
        email2: String,
        parentName: String,
        parentContact: String,
        majorMinor: String,
        mostRecentCol: {
            type: Schema.Types.ObjectId,
            ref: 'College'
        },
        cumColGPA: Number,
        lastTermGPA: Number,
        mostRecentEmp: String,
        mostRecentEnrolStatus: String,
        transferStatus: {
            type: [String],
            validate: {
                validator: validator.transferStatus,
                message: messages.default
            }
        },
        studentSupportOrgName: {
            type: [String],
            validate: {
                validator: validator.studentSupportOrgName,
                message: messages.default
            }
        },
        studentSupportOrgNameOther: String,
        cohort: String,
        hsGradDate: Date,
        iniEnrollDate: Date,
        ethnicity: {
            type: Number,
            min: [
                1, 'Ethnicity must be between 1 and 7'
            ],
            max: [7, 'Ethnicity must be between 1 and 7']
        },
        gender: {
            type: String,
            enum: enums.gender
        },
        SAT: {
            math: Number,
            cr: Number
        },
        actEquiv: Number,
        hsGPA: Number,
        terms: [termSchema(Schema)],
        graduations: [graduationsSchema(Schema)],
        documents: [documentSchema(Schema)],
        caseNotes: [caseNotesSchema(Schema)],
        ferpa: {
            type: String,
            enum: enums.ferpa
        },
        remediationStatus: {
            type: [String],
            validate: {
                validator: validator.remediationStatus,
                message: messages.default
            }
        },
        residency: {
            type: String,
            enum: enums.residency
        },
        employmentStatus: {
            type: [String],
            validate: {
                validator: validator.employmentStatus,
                message: messages.default
            }
        },
        progressToGradAss: {
            type: String,
            enum: enums.progressToGradAss
        },
        progressToGradBa: {
            type: String,
            enum: enums.progressToGradBa
        },
        tshirtSize: {
            type: String,
            enum: enums.tshirtSize
        },
        sweatshirtSize: {
            type: String,
            enum: enums.sweatshirtSize
        },
        applicationWave: {
            type: Number,
            min: [1, 'Application Wave must be between 1 and 3'],
            max: [3, 'Application Wave must be between 1 and 3']
        },
        commonApp: {
            type: String,
            enum: enums.commonApp
        },

        housingStatus: {
            type: String,
            enum: enums.housingStatus
        },
        physImmunRecords: {
            type: String,
            enum: enums.physImmunRecords
        },
        registeredForClasses: {
            type: String,
            enum: enums.registeredForClasses
        },
        postSecPlan: {
            type: String,
            enum: enums.postSecPlan
        },
        hs: {
            type: Schema.Types.ObjectId,
            ref: 'School'
        },
        intendedCollege: {
            type: Schema.Types.ObjectId,
            ref: 'College'
        },
        act: Number,
        osis: Number,
        startedFafsa: {
            type: Boolean,
            default: false
        },
        needsFollowup: {
            type: Boolean,
            default: false
        },
        completedFafsa: {
            type: Boolean,
            default: false
        },
        completedTap: {
            type: Boolean,
            default: false
        },
        needGap: {
            type: Boolean,
            default: false
        },
        amountOfNeedGap: Number,
        facebookName: String,
        parentPhone: String,
        // TO ADD IN
        attendingMeetupDay: {
            type: Boolean,
            default: false
        },
        expectedGrad: Number,
        photoReleaseForm: {
            type: Boolean,
            default: false
        },
        psat: Number,
        eaEdApplications: {
            type: Boolean,
            default: false
        },
        lettersOfRecommendation: {
            type: Boolean,
            default: false
        },
        taxDocumentsSubmitted: {
            type: Boolean,
            default: false
        },
        opportunityProgramEligible: {
            type: Boolean,
            default: false
        },
        studentAidReportReceived: {
            type: Boolean,
            default: false
        },
        fsaid: Number,
        cssProfileCreated: {
            type: Boolean,
            default: false
        },
        awardLetterReceived: {
            type: Boolean,
            default: false
        },
        scholarshipAmount: Number,
        cunyApp: {
            type: String,
            enum: enums.cunyApp
        },
        sunyApp: {
            type: String,
            enum: enums.sunyApp
        },
        desiredFieldOfStudy: String,
        completedEssay: {
            type: Boolean,
            default: false
        },
        crewAdvisor: String,
        satSubjectTests: String,
        appliedToOtherSupportProgram: {
            type: Boolean,
            default: false
        },
        applications: [applicationsSchema(Schema)],
        degreeTitle: {
            type: [String],
            validate: {
                validator: validator.degreeTitle,
                message: messages.default
            }
        },
        gradDate: Date,
        preferredPronoun: String,
        nscRecordFound: {
            type: Boolean,
            default: false
        },
        preferredLanguage: String
    };
};
