export default Schema => ({
    fullName: {
        type: String
    },
    shortName: {
        type: String
    },
    navianceName: {
        type: String
    },
    collegeScorecardName: {
        type: String
    },
    testingPolicy: String,
    barronsRating: String,
    avgHsGpa: Number,
    percentFirstGen: Number,
    percentPellGrant: Number,
    freshRetRate: Number,
    gradRate: {
        white: Number,
        black: Number,
        hispanic: Number,
        overall: Number
    },
    collType: Number,
    durationType: {
        type: String,
        lowercase: true
    },
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
    percentileCR25: Number,
    percentileCR75: Number,
    percentileMath25: Number,
    percentileMath75: Number,
    numberStudents: Number,
    percentPartTimeEnrolled: Number,
    netPrice0to30: Number,
    netPrice30to48: Number,
    netPrice48to75: Number,
    netPrice75to110: Number,
    womenOnly: Boolean,
    percentDegrees1: Number,
    percentDegrees2: Number,
    percentDegrees3: Number,
    percentDegrees4: Number,
    percentDegrees5: Number,
    percentDegrees6: Number,
    percentDegrees7: Number,
    percentDegrees8: Number,
    percentDegrees9: Number,
    percentDegrees10: Number,
    percentDegrees11: Number,
    percentDegrees12: Number,
    percentDegrees13: Number,
    percentDegrees14: Number,
    percentDegrees15: Number,
    percentDegrees16: Number,
    percentStudents: {
        black: Number,
        hispanic: Number,
        asian: Number,
        white: Number
    }
});
