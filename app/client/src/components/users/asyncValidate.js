// validation helpers
import {userSchema} from '../../../../common/schemas';

const asyncValidate = (values) => {
    console.log('asyncValidate');
    const mongoose = window.mongoose;
    const Schema = mongoose.Schema;
    const User = new Schema(userSchema(Schema));
    const user = new mongoose.Document({}, User);

    Object.keys(values).map((key) => {
        user[key] = values[key];
    });

    const errors = {};

    return new Promise((resolve, reject) => {
        user.validate((mongooseError) => {
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

};

export default asyncValidate;