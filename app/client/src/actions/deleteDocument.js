import {
    DELETE_DOCUMENT_ERROR,
    DELETE_DOCUMENT_PENDING,
    DELETE_DOCUMENT_SUCCESS,
    SPINNER
} from './types';
import axios from 'axios';

const deleteDocument = (doc, osis) => (
    (dispatch) => {
        dispatch({
            type: SPINNER,
            payload: true
        });
        const params = {
            osis,
            deleteId: doc._id,
            Key: doc.Key
        };
        return axios.delete('/update-document', {params})
            .then((res) => {
                dispatch({
                    type: DELETE_DOCUMENT_SUCCESS,
                    payload: res.data,
                    osis
                });
                dispatch({
                    type: SPINNER,
                    payload: false
                });
            })
            .catch((err) => {
                dispatch({
                    type: DELETE_DOCUMENT_ERROR,
                    payload: err
                });
                dispatch({
                    type: SPINNER,
                    payload: false
                });
            });
    }
);

export default deleteDocument;
