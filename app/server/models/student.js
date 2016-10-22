const mongoose = require('mongoose');
import mongoosePaginate from 'mongoose-paginate';

const Schema = mongoose.Schema;
import studentValidation from './validation/studentValidation';

export const Student = new Schema(studentValidation(Schema));
Student.plugin(mongoosePaginate);

export default mongoose.model('Student', Student);
