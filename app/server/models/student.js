const mongoose = require('mongoose');

const Schema = mongoose.Schema;
import studentValidation from './validation/studentValidation';

export const Student = new Schema(studentValidation);

export default mongoose.model('Student', Student);
