import moment from 'moment';
import { SPINNER_PAGE } from '../types';
import { studentKeys } from '../../../../common/fieldKeys';
import json2csv from 'json2csv';
import keyBy from 'lodash/keyBy';
const studentKeysObj = keyBy(studentKeys, 'dbName');

const exportStudents = (fields, students) => dispatch => {
    dispatch({
        type: SPINNER_PAGE,
        payload: true
    });
    const fieldNames = fields
        .map(field => {
            if (studentKeysObj[field]) {
                return studentKeysObj[field].fieldName;
            }
            return 'delete';
        })
        .filter(field => field !== 'delete');
    const quotes = '';
    const doubleQuotes = '"';
    const csv = json2csv(
        {
            data: students,
            fields,
            fieldNames,
            quotes,
            doubleQuotes
        },
        (err, csvFile) => {
            if (err) {
                return console.log(err);
            }
            const a = document.createElement('a');
            a.setAttribute('href', `data:attachment/csv;charset=utf-8,${encodeURI(csvFile)}`);
            a.setAttribute('target', '_blank');
            a.setAttribute('download', `students-${moment(new Date()).format('lll')}.csv`);
            a.click();
            dispatch({
                type: SPINNER_PAGE,
                payload: false
            });
        }
    );
};

export default exportStudents;
