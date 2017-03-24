import _ from 'lodash';

const merge = (A = {}, B = {}) => {
    _.forOwn(B, (value, key) => {
        if (_.isPlainObject(A[key])) {
            if (_.isPlainObject(B[key])) {
                merge(A[key], B[key]);
            }
        } else if (_.isArray(A[key])) {
            if (_.isArray[B[key]]) {
                B[key].forEach((value) => {
                    if (!A[key].includes[value]) {
                        A[key].push(value);
                    }
                })
            }
        } else {
            if (B[key]) {
                A[key] = B[key];
            }
        }
    });
    return A;
};

export default merge;
