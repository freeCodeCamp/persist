import keyBy from 'lodash/keyBy';
import get from 'lodash/get';

export default (keysList, fieldList) => {
    const keys = {
        'college': [],
        'school': [],
        'checkbox': [],
        'checkbox_add': [],
        'datepicker': [],
        'normal': []
    };
    const fieldListObj = keyBy(fieldList, 'dbName');
    keysList.forEach((fieldKey) => {
        switch (get(fieldListObj, `${fieldKey}.type`, null)) {
            case 'college':
                keys['college'].push(fieldKey);
                return;
            case 'school':
                keys['school'].push(fieldKey);
                return;
        }
        switch (get(fieldListObj, `${fieldKey}.fieldType`, null)) {
            case 'Checkbox':
                keys['checkbox'].push(fieldKey);
                return;
            case 'Checkbox_Add':
                keys['checkbox_add'].push(fieldKey);
                return;
            case 'DatePicker':
                keys['datepicker'].push(fieldKey);
                return;
            default:
                keys['normal'].push(fieldKey);
                return;
        }
    });
    return keys;
};
