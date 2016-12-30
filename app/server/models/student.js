const mongoose = require('mongoose');
import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;
import {studentSchema} from '../../common/schemas';

export const Student = new Schema(studentSchema(Schema));
Student.plugin(mongoosePaginate);

export default mongoose.model('Student', Student);
