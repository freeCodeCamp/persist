import keyBy from 'lodash/keyBy';

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
        switch (fieldListObj[fieldKey].type) {
            case 'college':
                keys['college'].push(fieldKey);
                return;
            case 'school':
                keys['school'].push(fieldKey);
                return;
        }
        switch (fieldListObj[fieldKey].fieldType) {
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
