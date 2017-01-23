'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getSign = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _mongoose = require('mongoose');

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPutSigned = function getPutSigned(fileType, s3, _id, res, Key) {
    var bucketName = process.env.S3_BUCKET_NAME;
    var s3Params = {
        Bucket: bucketName,
        Key: Key,
        Expires: 60,
        ContentType: fileType || 'application/x-www-form-urlencoded',
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3Params, function (err, data) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        var returnData = {
            signedRequest: data,
            _id: _id,
            Key: Key,
            downloadLink: 'https://' + bucketName + '.s3.amazonaws.com/' + Key
        };
        res.status(200).json(returnData);
    });
};

var getSign = exports.getSign = function getSign(req, res) {
    _awsSdk2.default.config.update({ region: 'us-east-1' });
    var file = req.query['file'];
    var fileType = req.query['fileType'];
    var fileName = req.query['fileName'] || 'provide-file-name';
    var uploadedFileName = req.query['uploadedFileName'];
    var oldKey = req.query['oldKey'];
    var ext = _path2.default.extname(uploadedFileName);
    var baseName = _path2.default.basename(fileName, ext);
    var _id = _mongoose.Types.ObjectId();
    var Key = 'documents/' + baseName + '-' + _id.toString() + ext;
    var s3 = new _awsSdk2.default.S3();
    if (oldKey) {
        var _ret = function () {
            oldKey = 'documents/' + oldKey;
            var bucketName = process.env.S3_BUCKET_NAME;
            var params = { Bucket: bucketName, CopySource: bucketName + '/' + oldKey, Key: Key };
            return {
                v: s3.copyObject(params, function (err) {
                    if (err) {
                        console.log('copy', err);
                        return res.status(500).send(err);
                    }
                    s3.deleteObject({ Key: oldKey, Bucket: bucketName }, function (err) {
                        if (err) {
                            console.log('delete', err);
                            return res.status(500).send(err);
                        }
                        if (!file) {
                            var returnData = {
                                _id: _id,
                                Key: Key,
                                downloadLink: 'https://' + bucketName + '.s3.amazonaws.com/' + Key
                            };
                            return res.status(200).json(returnData);
                        }
                        getPutSigned(fileType, s3, _id, res, Key);
                    });
                })
            };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
    getPutSigned(fileType, s3, _id, res, Key);
};

exports.default = {
    getSign: getSign
};