import { forOwn } from 'lodash';

const setUndefined = record => {
    forOwn(record, (value, key) => {
        if (record[key] === 'set undefined') {
            record[key] = undefined;
        }
    });
};

export default setUndefined;
