'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateDocument = exports.deleteDocument = undefined;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _student = require('../models/student');

var _student2 = _interopRequireDefault(_student);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deleteDocument = exports.deleteDocument = function deleteDocument(req, res) {
    var bucketName = process.env.S3_BUCKET_NAME;
    _awsSdk2.default.config.update({ region: 'us-east-1' });
    var s3 = new _awsSdk2.default.S3();
    var _req$query = req.query,
        osis = _req$query.osis,
        deleteId = _req$query.deleteId,
        Key = _req$query.Key;

    _student2.default.findOne({
        osis: osis
    }, function (err, student) {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        s3.deleteObject({ Key: 'documents/' + Key, Bucket: bucketName }, function (err) {
            if (err) {
                console.log('delete', err);
            }
        });
        var documents = student.documents;
        if (deleteId) {
            documents = documents.filter(function (doc) {
                return doc._id.toString() !== deleteId;
            });
        }
        student.documents = documents;
        student.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json(documents);
        });
    });
};

var updateDocument = exports.updateDocument = function updateDocument(req, res) {
    var document = req.body;
    var oldId = document.updateId;
    _student2.default.findOne({
        osis: document.osis
    }, function (err, student) {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        var documents = student.documents;
        var oldDocument = void 0;
        if (oldId) {
            oldDocument = documents.find(function (doc) {
                return doc._id.toString() === oldId;
            });
        }
        if (oldDocument) {
            (0, _merge2.default)(oldDocument, document);
        } else {
            documents.push(document);
        }
        student.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json(documents);
        });
    });
};

exports.default = {
    deleteDocument: deleteDocument,
    updateDocument: updateDocument
};