// validation helpers
import {forOwn} from 'lodash';
import {studentSchema} from '../../../../common/schemas';

const asyncValidate = (values) => {
    console.log('asyncValidate');
    const mongoose = window.mongoose;
    const Schema = mongoose.Schema;

    const Student = new Schema(studentSchema(Schema));

    const student = new mongoose.Document({}, Student);
    
    forOwn(values, (value, key) => {
        if (key !== '_id' && values[key]) {
            student[key] = values[key];
        }
    });

    const errors = {};

    const isomorphicValidate = new Promise((resolve, reject) => {
        student.validate(function(mongooseError) {
            if (!mongooseError) {
                resolve();
                return;
            }
            Object.keys(mongooseError.errors).map((key) => {
                errors[key] = mongooseError['errors'][key]['message'];
            });
            reject(errors);
        });
    });

    return isomorphicValidate;

};

export default asyncValidate;