// validation helpers
import studentValidation from '../../../../server/models/validation/studentValidation';

const asyncValidate = (values) => {
    console.log('asyncValidate');
    var mongoose = window.mongoose;
    var Schema = mongoose.Schema;

    const Student = new Schema(studentValidation(Schema));

    var student = new mongoose.Document({}, Student);

    Object.keys(values).map((key) => {
        student[key] = values[key];
    });

    const errors = {};

    const isomorphicValidate = new Promise((resolve, reject) => {
        student.validate(function (mongooseError) {
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