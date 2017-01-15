import keyBy from 'lodash/keyBy';
import {studentKeys} from './fieldKeys';
const studentKeysObj = keyBy(studentKeys, 'dbName');

export default (keysList) => {
    const keys = {
        'college': [],
        'school': [],
        'checkbox': [],
        'datepicker': [],
        'normal': []
    };
    keysList.forEach((studentKey) => {
        switch (studentKeysObj[studentKey].type) {
            case 'college':
                keys['college'].push(studentKey);
                return;
            case 'school':
                keys['school'].push(studentKey);
                return;
        }
        switch (studentKeysObj[studentKey].fieldType) {
            case 'Checkbox':
                keys['checkbox'].push(studentKey);
                return;
            case 'DatePicker':
                keys['datepicker'].push(studentKey);
                return;
            default:
                keys['normal'].push(studentKey);
                return;
        }
    });
    return keys;
};
