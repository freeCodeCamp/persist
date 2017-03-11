'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateAlias = exports.deleteAlias = undefined;

var _student = require('../models/student');

var _student2 = _interopRequireDefault(_student);

var _sortBy = require('lodash/sortBy');

var _sortBy2 = _interopRequireDefault(_sortBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deleteAlias = exports.deleteAlias = function deleteAlias(req, res) {
    var _req$query = req.query,
        osis = _req$query.osis,
        _id = _req$query._id;

    _student2.default.findOne({ osis: osis }).update({ $pull: { aliases: { _id: _id } } }).exec(function (err, student) {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        return res.status(200).json({ status: 'done' });
    });
};

var updateAlias = exports.updateAlias = function updateAlias(req, res) {
    var newAlias = req.body.alias;
    var osis = newAlias.osis,
        _id = newAlias._id;

    _student2.default.findOne({
        osis: osis
    }, function (err, student) {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        var aliases = student.aliases;
        if (_id) {
            aliases = aliases.filter(function (alias) {
                return alias._id.toString() !== _id.toString();
            });
        }
        aliases.push(newAlias);
        aliases = (0, _sortBy2.default)(aliases, function (alias) {
            return alias.enrolBegin;
        }).reverse();
        student.aliases = aliases;
        student.save(function (err, updatedStudent) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json(updatedStudent.aliases);
        });
    });
};

exports.default = {
    deleteAlias: deleteAlias,
    updateAlias: updateAlias
};