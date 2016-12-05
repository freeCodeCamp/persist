import {Types} from 'mongoose';
import aws from 'aws-sdk';

export default (req, res) => {
    const fileType = req.query['file-type'];
    const _id = Types.ObjectId();
    const s3 = new aws.S3();
    const bucketName = process.env.S3_BUCKET_NAME;
    const s3Params = {
        Bucket: bucketName,
        Key: _id,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        const returnData = {
            signedRequest: data,
            _id,
            url: `https://${bucketName}.s3.amazonaws.com/${_id}`
        };
        res.send(200).json(returnData);
    });
}
