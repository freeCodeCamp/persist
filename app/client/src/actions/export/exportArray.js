import moment from 'moment';
import json2csv from 'json2csv';
import {
    SPINNER_PAGE
} from '../types';
import {
    applicationKeys,
    collegeGraduationKeys,
    collegeKeys,
    termKeys,
    caseNotesKeys
} from '../../../../common/fieldKeys';

const exportArrays = (students, type) => (
    (dispatch) => {
        dispatch({
            type: SPINNER_PAGE,
            payload: true
        });
        const quotes = '';
        const doubleQuotes = '"';
        let fieldNames, fields;
        switch (type) {
            case 'applications':
                fieldNames = _.map(applicationKeys, 'fieldName');
                fields = _.map(applicationKeys, 'dbName');
                break;
            case 'terms':
                fieldNames = _.map(termKeys, 'fieldName');
                fields = _.map(termKeys, 'dbName');
                break;
            case 'caseNotes':
                fieldNames = _.map(caseNotesKeys, 'fieldName');
                fields = _.map(caseNotesKeys, 'dbName');
        }
        const csv = json2csv({
            data: students,
            fields,
            fieldNames,
            quotes,
            doubleQuotes
        }, (err, csvFile) => {
            if (err) {
                return console.log(err);
            }
            const a = document.createElement('a');
            a.setAttribute('href', `data:attachment/csv;charset=utf-8,${encodeURI(csvFile)}`);
            a.setAttribute('target', '_blank');
            a.setAttribute('download', `${type}-${moment(new Date()).format('lll')}.csv`);
            a.click();
            dispatch({
                type: SPINNER_PAGE,
                payload: false
            });
        });
    }
);

export default exportArrays;
