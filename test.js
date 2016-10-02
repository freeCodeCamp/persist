import mongoose from 'mongoose';
import ourBrilliantFunction from './app/server/utils/save_csv_colleges';

import school from './app/server/models/student';

mongoose.connect('mongodb://localhost:27017/nyc_outward');


// ourBrilliantFunction('./data/collegeSeedData.csv').then((data) => {
//   console.log(data);
// }).catch((err) => {
//   console.log(err);
// });

const newSchool = new school();

newSchool.tags = ['test', 'test'];

newSchool.save((err) => {

  if (err) {
    console.log(err);
    return;
  }

  //save the shit
  console.log('save it man- its good to go!')
});

// newSchool.save(function(err, data) {
//   if (err) console.log(err);
//   console.log(data);
// });
