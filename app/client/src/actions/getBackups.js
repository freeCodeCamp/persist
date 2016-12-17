import {axios} from './utils';
import moment from 'moment';

const getBackups = () => (
    (dispatch) => {
        return axios().get('/get-database-backups')
            .then((res) => {
                const keys = res.data;
                return keys.map((key) => {
                    const dateString = key.match(/^backups\/(.+)\.tar$/)[1];
                    return {
                        Key: key,
                        dateString: dateString,
                        momentDate: moment(dateString, 'DD_MM_YYYY')
                    }
                });
            })
            .catch((err) => {
                console.log(err.response);
            })
    }
);

export default getBackups;
