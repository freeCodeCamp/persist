import Student from '../../models/student';
import merge from 'lodash/merge';

export default (req, res) => {
    const document = req.body;
    const oldId = document.updateId;
    Student.findOne({
        osis: document.osis
    }, (err, student) => {
        if (err || !student) {
            return res.status(500).send(err || 'student not found');
        }
        const documents = student.documents;
        let oldDocument;
        if (oldId) {
            oldDocument = documents.find((doc) => (
                doc._id.toString() === oldId
            ));
        }
        if (oldDocument) {
            merge(oldDocument, document);
        } else {
            documents.push(document);
        }
        student.save((err) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json(documents);
        });
    });
}
