'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getDatabaseBackups = exports.restoreDatabase = exports.backupDatabase = undefined;

var _mongodbBackup = require('mongodb-backup');

var _mongodbBackup2 = _interopRequireDefault(_mongodbBackup);

var _mongodbRestore = require('mongodb-restore');

var _mongodbRestore2 = _interopRequireDefault(_mongodbRestore);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var backupToS3 = function backupToS3(req, res, Key, err) {
    if (err) {
        console.log(err);
        return res.status(500).send(err);
    }
    var bucketName = process.env.S3_BUCKET_NAME;
    _awsSdk2.default.config.update({ region: 'us-east-1' });
    var s3 = new _awsSdk2.default.S3();
    var s3Params = {
        Bucket: bucketName,
        Key: Key + '.tar',
        ACL: 'private',
        Body: _fsExtra2.default.createReadStream('./' + Key + '.tar')
    };
    s3.putObject(s3Params, function (err) {
        if (err) {
            console.log('backup', err);
            return res.status(500).send(err);
        }
        _fsExtra2.default.remove(__dirname + '/../../../backups', function (err) {
            if (err) {
                return res.status(500).send({ error: 'deleting files failed' });
            }
            res.status(200).json({ msg: 'backup successfully done' });
        });
    });
};

var backupDatabase = exports.backupDatabase = function backupDatabase(req, res) {
    var Key = 'backups/' + (0, _moment2.default)().format('DD_MM_YYYY');
    var backupPath = __dirname + '/../../../backups';
    var params = {
        uri: process.env.MONGODB_URI,
        root: backupPath,
        tar: (0, _moment2.default)().format('DD_MM_YYYY') + '.tar',
        callback: backupToS3.bind(null, req, res, Key)
    };
    (0, _mongodbBackup2.default)(params);
};

var downloadFromS3 = function downloadFromS3(req, res, Key) {
    var bucketName = process.env.S3_BUCKET_NAME;
    _awsSdk2.default.config.update({ region: 'us-east-1' });
    var s3 = new _awsSdk2.default.S3();
    var s3Params = {
        Bucket: bucketName,
        Key: Key
    };
    s3.getObject(s3Params, function (err, data) {
        if (err) {
            return res.status(500).json({ error: 'Not able to get the database from s3 storage' });
        }
        var databaseStream = new _stream2.default.PassThrough();
        databaseStream.end(data.Body);
        (0, _mongodbRestore2.default)({
            uri: process.env.MONGODB_URI,
            stream: databaseStream,
            drop: true,
            callback: function callback(err) {
                if (err) {
                    return res.status(500).json({ error: 'Not able to restore data on heroku' });
                }
                res.status(200).json({ message: 'Data restored' });
            }
        });
    });
};

var restoreDatabase = exports.restoreDatabase = function restoreDatabase(req, res) {
    var Key = req.body.Key;
    downloadFromS3(req, res, Key);
};

var getDatabaseBackups = exports.getDatabaseBackups = function getDatabaseBackups(req, res) {
    var bucketName = process.env.S3_BUCKET_NAME;
    _awsSdk2.default.config.update({ region: 'us-east-1' });
    var s3 = new _awsSdk2.default.S3();
    var s3Params = {
        Bucket: bucketName,
        Prefix: 'backups/'
    };
    s3.listObjectsV2(s3Params, function (err, data) {
        if (err) {
            return res.status(500).json({ error: 'Not able to get list from amazon.' });
        }
        var backups = data.Contents.filter(function (backup) {
            return backup.Size > 0;
        });
        backups = backups.map(function (backup) {
            return backup.Key;
        });
        res.status(200).json(backups);
    });
};

exports.default = {
    backupDatabase: backupDatabase,
    restoreDatabase: restoreDatabase,
    getDatabaseBackups: getDatabaseBackups
};