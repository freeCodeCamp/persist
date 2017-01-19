import moment from 'moment';
import {
    SPINNER
} from '../types';
import {axios} from '../utils';

const exportStudents = (fields, students) => (
    (dispatch) => {
        dispatch({
            type: SPINNER,
            payload: true
        });
        const params = {
            fields,
            students
        };
        return axios().post('/export-students', params)
            .then((res) => {
                dispatch({
                    type: SPINNER,
                    payload: false
                });
                const a = document.createElement('a');
                a.setAttribute('href', `data:attachment/csv;charset=utf-8,${encodeURI(res.data)}`);
                a.setAttribute('target', '_blank');
                a.setAttribute('download', `students-${moment(new Date()).format('lll')}.csv`);
                a.click();
            })
            .catch((err) => {
                dispatch({
                    type: SPINNER,
                    payload: false
                });
            });
    }
);

export default exportStudents;
