import {
    SAVE_DOCUMENT_ERROR,
    SAVE_DOCUMENT_PENDING,
    SAVE_DOCUMENT_SUCCESS,
    SPINNER
} from './types';
import {axios} from './utils';

const updateDocument = (doc, newDocument, updateId, osis, dispatch) => {
    const document = doc;
    document.updateId = updateId;
    document.name = newDocument.name;
    document.type = newDocument.type;
    document.osis = osis;
    return axios().post('/update-document', document)
        .then((res) => {
            dispatch({
                type: SAVE_DOCUMENT_SUCCESS,
                payload: res.data,
                osis: osis
            });
            dispatch({
                type: SPINNER,
                payload: false
            });
        })
        .catch(err => {
            dispatch({
                type: SAVE_DOCUMENT_ERROR,
                payload: err
            });
            dispatch({
                type: SPINNER,
                payload: true
            });
        });
};

const saveDocument = (oldDocument, newDocument, osis) => (
    (dispatch) => {
        const file = newDocument.document;
        const oldKey = oldDocument.Key;
        const params = {};
        if (oldKey && oldDocument.name !== newDocument.name) {
            params.oldKey = oldKey;
        }
        params.uploadedFileName = file ? file.name : oldKey;
        params.file = !!file;
        params.fileName = newDocument.name;
        dispatch({
            type: SPINNER,
            payload: true
        });
        return axios().get('/sign-s3', {params})
            .then((res) => {
                return res.data;
            })
            .then((doc) => {
                if (file) {
                    const signedUrl = doc.signedRequest;
                    return axios.put(signedUrl, file)
                        .then(() => {
                            updateDocument(doc, newDocument, oldDocument._id, osis, dispatch);
                        })
                        .catch((err) => {
                            dispatch({
                                type: SAVE_DOCUMENT_ERROR,
                                payload: err
                            });
                            dispatch({
                                type: SPINNER,
                                payload: false
                            });
                        });
                }
                return updateDocument(doc, newDocument, oldDocument._id, osis, dispatch);
            });
    }
);

export default saveDocument;
