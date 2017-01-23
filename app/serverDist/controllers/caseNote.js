'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateCaseNote = exports.deleteCaseNote = undefined;

var _student = require('../models/student');

var _student2 = _interopRequireDefault(_student);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deleteCaseNote = exports.deleteCaseNote = function deleteCaseNote(req, res) {
    var _req$query = req.query,
        osis = _req$query.osis,
        _id = _req$query._id;

    _student2.default.findOne({ osis: osis }).update({ $pull: { caseNotes: { _id: _id } } }).exec(function (err, student) {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        return res.status(200).json({ status: 'done' });
    });
};

var updateCaseNote = exports.updateCaseNote = function updateCaseNote(req, res) {
    var newCaseNote = req.body.caseNote;
    var osis = newCaseNote.osis,
        _id = newCaseNote._id;

    _student2.default.findOne({
        osis: osis
    }, function (err, student) {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        var caseNotes = student.caseNotes;
        if (_id) {
            caseNotes = caseNotes.filter(function (caseNote) {
                return caseNote._id.toString() !== _id.toString();
            });
        }
        caseNotes.unshift(newCaseNote);
        student.caseNotes = caseNotes;
        student.save(function (err, updatedStudent) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json(updatedStudent.caseNotes);
        });
    });
};

exports.default = {
    deleteCaseNote: deleteCaseNote,
    updateCaseNote: updateCaseNote
};