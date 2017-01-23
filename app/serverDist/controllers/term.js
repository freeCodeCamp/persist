'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateTerm = exports.deleteTerm = undefined;

var _student = require('../models/student');

var _student2 = _interopRequireDefault(_student);

var _sortBy = require('lodash/sortBy');

var _sortBy2 = _interopRequireDefault(_sortBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deleteTerm = exports.deleteTerm = function deleteTerm(req, res) {
    var _req$query = req.query,
        osis = _req$query.osis,
        _id = _req$query._id;

    _student2.default.findOne({ osis: osis }).update({ $pull: { terms: { _id: _id } } }).exec(function (err, student) {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        return res.status(200).json({ status: 'done' });
    });
};

var updateTerm = exports.updateTerm = function updateTerm(req, res) {
    var newTerm = req.body.term;
    var osis = newTerm.osis,
        _id = newTerm._id;

    _student2.default.findOne({
        osis: osis
    }, function (err, student) {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        var terms = student.terms;
        if (_id) {
            terms = terms.filter(function (term) {
                return term._id.toString() !== _id.toString();
            });
        }
        terms.push(newTerm);
        terms = (0, _sortBy2.default)(terms, function (term) {
            return term.enrolBegin;
        }).reverse();
        student.terms = terms;
        student.save(function (err, updatedStudent) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json(updatedStudent.terms);
        });
    });
};

exports.default = {
    deleteTerm: deleteTerm,
    updateTerm: updateTerm
};