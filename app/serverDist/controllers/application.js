'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateApplication = exports.deleteApplication = undefined;

var _student = require('../models/student');

var _student2 = _interopRequireDefault(_student);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deleteApplication = exports.deleteApplication = function deleteApplication(req, res) {
    var _req$query = req.query,
        osis = _req$query.osis,
        _id = _req$query._id;

    _student2.default.findOne({ osis: osis }).update({ $pull: { applications: { _id: _id } } }).exec(function (err, student) {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        return res.status(200).json({ status: 'done' });
    });
};

var updateApplication = exports.updateApplication = function updateApplication(req, res) {
    var newApplication = req.body.application;
    var osis = newApplication.osis,
        _id = newApplication._id;

    _student2.default.findOne({
        osis: osis
    }, function (err, student) {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        var applications = student.applications;
        if (_id) {
            applications = applications.filter(function (application) {
                return application._id.toString() !== _id.toString();
            });
        }
        applications.unshift(newApplication);
        student.applications = applications;
        student.save(function (err, updatedStudent) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json(updatedStudent.applications);
        });
    });
};

exports.default = {
    deleteApplication: deleteApplication,
    updateApplication: updateApplication
};