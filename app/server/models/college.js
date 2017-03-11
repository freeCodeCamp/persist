import {collegeSchema} from '../../common/schemas';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const College = new Schema(collegeSchema(Schema));
College.index({ fullName: 1, shortName: 1, navianceName: 1, collegeScorecardName: 1 }, { unique: true });
export default mongoose.model('College', College);
