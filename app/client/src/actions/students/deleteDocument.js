import { DELETE_DOCUMENT_ERROR, DELETE_DOCUMENT_PENDING, DELETE_DOCUMENT_SUCCESS, SPINNER_PAGE } from '../types';
import { axios } from '../utils';

const deleteDocument = (doc, osis) => dispatch => {
    dispatch({
        type: SPINNER_PAGE,
        payload: true
    });
    const params = {
        osis,
        deleteId: doc._id,
        Key: doc.Key
    };
    return axios()
        .delete('/update-document', { params })
        .then(res => {
            dispatch({
                type: DELETE_DOCUMENT_SUCCESS,
                payload: res.data,
                osis
            });
            dispatch({
                type: SPINNER_PAGE,
                payload: false
            });
        })
        .catch(err => {
            dispatch({
                type: DELETE_DOCUMENT_ERROR,
                payload: err
            });
            dispatch({
                type: SPINNER_PAGE,
                payload: false
            });
        });
};

export default deleteDocument;
