import {collegeSchema} from '../../common/schemas';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const College = new Schema(collegeSchema(Schema));
export default mongoose.model('College', College);

// unused at present
// medSatMath: Number,
// medSatCr: Number,
// locale: String,
// enrollmentYears: {}