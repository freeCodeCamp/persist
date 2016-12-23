import mongoose from 'mongoose';

import Student from './app/server/models/student';
import School from './app/server/models/school';

mongoose.connect('mongodb://localhost:27017/nyc_outward');

Student.find({}, (err, students) => {
    if (err) {
        console.log('initial err');
    }
    students.forEach((student) => {
        console.log(student.hs);
        if (student.hs) {
            School.find({name: student.hs}, (err, school) => {
                if (err) {
                    console.log(err, student._id);
                }
                student.hs = school._id;
                student.save((err, stu) => {
                    if (err) {
                        console.log(student._id);
                        return;
                    }
                })
            })
        }
    })
});
