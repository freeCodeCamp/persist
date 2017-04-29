import axios from 'axios';
import cookie from 'react-cookie';

export default () => {
    const token = cookie.load('token');
    const config = {
        headers: {
            Authorization: token
        }
    };
    return axios.create(config);
};
