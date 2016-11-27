import {GET_ALL_COLLEGES_ERROR, GET_ALL_COLLEGES_PENDING, GET_ALL_COLLEGES_SUCCESS} from './types';
import axios from 'axios';

export default () => {
    return (dispatch) => {
        dispatch({
            type: GET_ALL_COLLEGES_PENDING
        });

        return axios.get('/api/colleges')
            .then((response) => {
                dispatch({
                    type: GET_ALL_COLLEGES_SUCCESS,
                    payload: response.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: GET_ALL_COLLEGES_ERROR,
                    payload: err
                });
            })
    }
};
