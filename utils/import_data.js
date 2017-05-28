import restore from 'mongodb-restore'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()


restore({
  uri: process.env.MONGODB_URI,
  stream: fs.createReadStream(process.argv[2]),
  callback: function(err) {
    console.log('done')
  }
});

