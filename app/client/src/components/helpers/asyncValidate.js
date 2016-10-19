// validation helpers
import studentValidation from '../../../../server/models/validation/studentValidation';

const asyncValidate = (values) => {

  const mongoose = window.mongoose;
  const Student = new mongoose.Schema(studentValidation);
  var student = new mongoose.Document({}, Student);
  Object.keys(values).map((key) => {
    student[key] = values[key];
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