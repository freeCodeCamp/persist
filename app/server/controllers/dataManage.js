import backup from 'mongodb-backup';
import restore from 'mongodb-restore';
import moment from 'moment';
import aws from 'aws-sdk';
import fs from 'fs-extra';
import stream from 'stream';

const backupToS3 = (req, res, Key, err) => {
    if (err) {
        console.log(err);
        return res.status(500).send(err);
    }
    const bucketName = process.env.S3_BUCKET_NAME;
    aws.config.update({region: 'us-east-1'});
    const s3 = new aws.S3();
    const s3Params = {
        Bucket: bucketName,
        Key: `${Key}.tar`,
        ACL: 'private',
        Body: fs.createReadStream(`./${Key}.tar`)
    };
    s3.putObject(s3Params, (err) => {
        if (err) {
            console.log('backup', err);
            return res.status(500).send(err);
        }
        fs.remove(`${__dirname}/../../../backups`, (err) => {
            if (err) {
                return res.status(500).send({error: 'deleting files failed'});
            }
            res.status(200).json({msg: 'backup successfully done'});
        })
    });
};

export const backupDatabase = (req, res) => {
    const Key = `backups/${moment().format('DD_MM_YYYY')}`;
    const backupPath = `${__dirname}/../../../backups`;
    const params = {
        uri: process.env.MONGODB_URI,
        root: backupPath,
        tar: `${moment().format('DD_MM_YYYY')}.tar`,
        callback: backupToS3.bind(null, req, res, Key)
    };
    backup(params);
};

const downloadFromS3 = (req, res, Key) => {
    const bucketName = process.env.S3_BUCKET_NAME;
    aws.config.update({region: 'us-east-1'});
    const s3 = new aws.S3();
    const s3Params = {
        Bucket: bucketName,
        Key: Key
    };
    s3.getObject(s3Params, (err, data) => {
        if (err) {
            return res.status(500).json({error: 'Not able to get the database from s3 storage'});
        }
        const databaseStream = new stream.PassThrough();
        databaseStream.end(data.Body);
        restore({
            uri: process.env.MONGODB_URI,
            stream: databaseStream,
            drop: true,
            callback: (err) => {
                if (err) {
                    return res.status(500).json({error: 'Not able to restore data on heroku'});
                }
                res.status(200).json({message: 'Data restored'});
            }
        });
    });
};

export const restoreDatabase = (req, res) => {
    const Key = req.body.Key;
    downloadFromS3(req, res, Key);
};

export const getDatabaseBackups = (req, res) => {
    const bucketName = process.env.S3_BUCKET_NAME;
    aws.config.update({region: 'us-east-1'});
    const s3 = new aws.S3();
    const s3Params = {
        Bucket: bucketName,
        Prefix: 'backups/'
    };
    s3.listObjectsV2(s3Params, (err, data) => {
        if (err) {
            return res.status(500).json({error: 'Not able to get list from amazon.'});
        }
        let backups = data.Contents.filter((backup) => (backup.Size > 0));
        backups = backups.map((backup) => (backup.Key));
        res.status(200).json(backups);
    });
};

export default {
    backupDatabase,
    restoreDatabase,
    getDatabaseBackups
}
