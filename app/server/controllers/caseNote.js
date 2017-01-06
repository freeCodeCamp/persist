import Student from '../models/student';

export const deleteCaseNote = (req, res) => {
    const {osis, _id} = req.query;
    Student.findOne({osis})
        .update({$pull: {caseNotes: {_id}}})
        .exec((err, student) => {
            if (err || !student) {
                return res.status(500).send(err || 'student not found');
            }
            return res.status(200).json({status: 'done'});
        });
};

export const updateCaseNote = (req, res) => {
    const newCaseNote = req.body.caseNote;
    const {osis, _id} = newCaseNote;
    Student.findOne({
        osis
    }, (err, student) => {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        let caseNotes = student.caseNotes;
        if (_id) {
            caseNotes = caseNotes.filter((caseNote) =>
                (caseNote._id.toString() !== _id.toString()));
        }
        caseNotes.unshift(newCaseNote);
        student.caseNotes = caseNotes;
        student.save((err, updatedStudent) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json(updatedStudent.caseNotes);
        });
    });
};

export default {
    deleteCaseNote,
    updateCaseNote
};
