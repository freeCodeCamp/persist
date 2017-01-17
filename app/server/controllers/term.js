import Student from '../models/student';
import sortBy from 'lodash/sortBy';

export const deleteTerm = (req, res) => {
    const {osis, _id} = req.query;
    Student.findOne({osis})
        .update({$pull: {terms: {_id}}})
        .exec((err, student) => {
            if (err || !student) {
                return res.status(500).send(err || 'student not found');
            }
            return res.status(200).json({status: 'done'});
        });
};

export const updateTerm = (req, res) => {
    const newTerm = req.body.term;
    const {osis, _id} = newTerm;
    Student.findOne({
        osis
    }, (err, student) => {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        let terms = student.terms;
        if (_id) {
            terms = terms.filter((term) =>
                (term._id.toString() !== _id.toString()));
        }
        terms.push(newTerm);
        terms = sortBy(terms, (term) => {
            return term.enrolBegin;
        }).reverse();
        student.terms = terms;
        student.save((err, updatedStudent) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json(updatedStudent.terms);
        });
    });
};

export default {
    deleteTerm,
    updateTerm
};
