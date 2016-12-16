import {Types} from 'mongoose';
import aws from 'aws-sdk';
import path from 'path';

const getPutSigned = (fileType, s3, _id, res, Key) => {
    const bucketName = process.env.S3_BUCKET_NAME;
    const s3Params = {
        Bucket: bucketName,
        Key: Key,
        Expires: 60,
        ContentType: fileType || 'application/x-www-form-urlencoded',
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        const returnData = {
            signedRequest: data,
            _id: _id,
            Key: Key,
            downloadLink: `https://${bucketName}.s3.amazonaws.com/${Key}`
        };
        res.status(200).json(returnData);
    });
};

export const getSign = (req, res) => {
    aws.config.update({region: 'us-east-1'});
    const file = req.query['file'];
    const fileType = req.query['fileType'];
    const fileName = req.query['fileName'] || 'provide-file-name';
    const uploadedFileName = req.query['uploadedFileName'];
    let oldKey = req.query['oldKey'];
    const ext = path.extname(uploadedFileName);
    const baseName = path.basename(fileName, ext);
    const _id = Types.ObjectId();
    const Key = `documents/${baseName}-${_id.toString()}${ext}`;
    const s3 = new aws.S3();
    if (oldKey) {
        oldKey = `documents/${oldKey}`;
        const bucketName = process.env.S3_BUCKET_NAME;
        const params = {Bucket: bucketName, CopySource: `${bucketName}/${oldKey}`, Key: Key};
        return s3.copyObject(params, (err) => {
            if (err) {
                console.log('copy', err);
                return res.status(500).send(err);
            }
            s3.deleteObject({Key: oldKey, Bucket: bucketName}, (err) => {
                if (err) {
                    console.log('delete', err);
                    return res.status(500).send(err);
                }
                if (!file) {
                    const returnData = {
                        _id: _id,
                        Key: Key,
                        downloadLink: `https://${bucketName}.s3.amazonaws.com/${Key}`
                    };
                    return res.status(200).json(returnData);
                }
                getPutSigned(fileType, s3, _id, res, Key);
            })
        })
    }
    getPutSigned(fileType, s3, _id, res, Key);
};

export default {
    getSign
};
