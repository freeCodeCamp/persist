import mongoose from 'mongoose';
import ourBrilliantFunction from './app/server/utils/save_csv';

// import Student from './app/server/models/student';

mongoose.connect('mongodb://localhost:27017/nyc_outward');




ourBrilliantFunction('./data.csv').then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err);
});

// const newStudent = new Student();

// newStudent.tags = ['Free Lunch Eligible', 'ELL'];
// newStudent.hsAttended = 'Baldwin';
// newStudent.gender = 'M';
// newStudent.ethnicity = 7;
// newStudent.transferStatus = ['2 Year to 4 Year',
//   '2 Year to 2 Year']
// newStudent.studentSupportOrgName = ['Other',
//   'SEEK'];

// newStudent.remediationStatus = ['Has Completed All Remediation Requirements'];
// newStudent.residency = 'A stupid field';
// newStudent.riskFactors = ['Taking time off',
//   'Shifting from Full-time to Part-time'];
// newStudent.employmentStatus = ['Seeking Employment'];
// newStudent.progressToGradAss = 'Short 12 credits or less to graduation';
// newStudent.progressToGradBa = 'Confirmed Graduate';


// console.log(newStudent)


// newStudent.save((err) => {

//   if (err) {
//     console.log(err);
//     return;
//   }

//   //save the shit
//   console.log('save it man- its good to go!');
// });
