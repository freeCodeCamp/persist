import { axios } from './utils';

const restoreDatabase = Key => dispatch =>
    axios()
        .post('/restore-database', { Key })
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            console.log(err.response);
        });

export default restoreDatabase;
