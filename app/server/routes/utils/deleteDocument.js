import aws from 'aws-sdk';
import Student from '../../models/student';

export default (req, res) => {
    const bucketName = process.env.S3_BUCKET_NAME;
    aws.config.update({region: 'us-east-1'});
    const s3 = new aws.S3();
    const {osis, deleteId, Key} = req.query;
    Student.findOne({
        osis: osis
    }, (err, student) => {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        s3.deleteObject({Key: Key, Bucket: bucketName}, (err) => {
            if (err) {
                console.log('delete', err);
            }
        });
        let documents = student.documents;
        if (deleteId) {
            documents = documents.filter((doc) => (
                doc._id.toString() !== deleteId
            ));
        }
        student.documents = documents;
        student.save((err) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json(documents);
        });
    });
}