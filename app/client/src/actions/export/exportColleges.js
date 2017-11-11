import moment from 'moment';
import { SPINNER_PAGE } from '../types';
import { collegeKeys } from '../../../../common/fieldKeys';
import json2csv from 'json2csv';
import map from 'lodash/map';

const exportColleges = colleges => dispatch => {
    dispatch({
        type: SPINNER_PAGE,
        payload: true
    });
    const fieldNames = map(collegeKeys, 'fieldName');
    const fields = map(collegeKeys, 'dbName');

    const csv = json2csv(
        {
            data: colleges,
            fields,
            fieldNames,
            quotes: '"',
            doubleQuotes: ''
        },
        (err, csvFile) => {
            if (err) {
                return console.log(err);
            }
            const a = document.createElement('a');
            const csvData = new Blob([csvFile], { type: 'text/csv' });
            a.setAttribute('href', URL.createObjectURL(csvData));
            a.setAttribute('target', '_blank');
            a.setAttribute('download', `colleges-${moment(new Date()).format('lll')}.csv`);
            document.body.appendChild(a);
            a.click();
            dispatch({
                type: SPINNER_PAGE,
                payload: false
            });
        }
    );
};

export default exportColleges;
