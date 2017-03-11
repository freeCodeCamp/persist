import Student from '../models/student';
import sortBy from 'lodash/sortBy';

export const deleteAlias = (req, res) => {
    const {osis, _id} = req.query;
    Student.findOne({osis})
        .update({$pull: {aliases: {_id}}})
        .exec((err, student) => {
            if (err || !student) {
                return res.status(500).send(err || 'student not found');
            }
            return res.status(200).json({status: 'done'});
        });
};

export const updateAlias = (req, res) => {
    const newAlias = req.body.alias;
    const {osis, _id} = newAlias;
    Student.findOne({
        osis
    }, (err, student) => {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        let aliases = student.aliases;
        if (_id) {
            aliases = aliases.filter((alias) =>
                (alias._id.toString() !== _id.toString()));
        }
        aliases.push(newAlias);
        aliases = sortBy(aliases, (alias) => {
            return alias.enrolBegin;
        }).reverse();
        student.aliases = aliases;
        student.save((err, updatedStudent) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json(updatedStudent.aliases);
        });
    });
};

export default {
    deleteAlias,
    updateAlias
};
