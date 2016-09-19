

import mongoose from 'mongoose';
import ourBrilliantFunction from './app/server/utils/save_csv';


mongoose.connect('mongodb://localhost:27017/nyc_outward');

console.time('data_save');
ourBrilliantFunction('./data2.csv').then((data) => {
	console.log(data);
	console.timeEnd('data_save');
}).catch((err) => {
	console.log(err);
});
