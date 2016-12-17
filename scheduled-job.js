if (process.env.NODE_ENV !== 'production') {
    // get environment variables
    require('dotenv').config();
}
const axios = require('axios');

const backupDatabase = () => {
    const baseUrl = `${process.env.ROOT_SCHEME}://${process.env.ROOT_HOST}`;
    axios.post(`${baseUrl}/backup-database`, {secret: process.env.SECRET})
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => {
            console.log(err.response);
        })
};

backupDatabase();
