import moment from 'moment';
import json2csv from 'json2csv';
import { map } from 'lodash';
import { SPINNER_PAGE } from '../types';
import { applicationKeys, collegeGraduationKeys, collegeKeys, termKeys, caseNotesKeys } from '../../../../common/fieldKeys';

const exportArray = (students, type) =>
    dispatch => {
        dispatch({
            type: SPINNER_PAGE,
            payload: true
        });
        const quotes = '';
        const doubleQuotes = '"';
        let fieldNames, fields;
        switch (type) {
            case 'applications':
                fieldNames = map(applicationKeys, 'fieldName');
                fields = map(applicationKeys, 'dbName');
                break;
            case 'terms':
                fieldNames = map(termKeys, 'fieldName');
                fields = map(termKeys, 'dbName');
                break;
            case 'caseNotes':
                fieldNames = map(caseNotesKeys, 'fieldName');
                fields = map(caseNotesKeys, 'dbName');
        }
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
                const csvData = new Blob([csvFile], { type: 'text/csv' });
                a.setAttribute('href', URL.createObjectURL(csvData));
                a.setAttribute('target', '_blank');
                a.setAttribute('download', `${type}-${moment(new Date()).format('lll')}.csv`);
                document.body.appendChild(a);
                a.click();
                dispatch({
                    type: SPINNER_PAGE,
                    payload: false
                });
            }
        );
    };

export default exportArray;
