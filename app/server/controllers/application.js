import Student from '../models/student';

export const deleteApplication = (req, res) => {
    const { osis, _id } = req.query;
    Student.findOne({ osis })
        .update({ $pull: { applications: { _id } } })
        .exec((err, student) => {
            if (err || !student) {
                return res.status(500).send(err || 'student not found');
            }
            return res.status(200).json({ status: 'done' });
        });
};

export const updateApplication = (req, res) => {
    const newApplication = req.body.application;
    const { osis, _id } = newApplication;
    Student.findOne(
        {
            osis
        },
        (err, student) => {
            if (err || !student) {
                return res.status(500).send(err || 'student not found');
            }
            let applications = student.applications;
            if (_id) {
                applications = applications.filter(application => application._id.toString() !== _id.toString());
            }
            applications.unshift(newApplication);
            student.applications = applications;
            student.save((err, updatedStudent) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).json(updatedStudent.applications);
            });
        }
    );
};

export default {
    deleteApplication,
    updateApplication
};
