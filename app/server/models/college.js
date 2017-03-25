import {collegeSchema} from '../../common/schemas';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const College = new Schema(collegeSchema(Schema));
export default mongoose.model('College', College);
