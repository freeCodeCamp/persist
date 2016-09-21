

import mongoose from 'mongoose';
import ourBrilliantFunction from './app/server/utils/save_csv';


mongoose.connect('mongodb://localhost:27017/nyc_outward');


ourBrilliantFunction('./data/seeddata.csv').then((data) => {
	console.log(data);
}).catch((err) => {
	console.log(err);
});
