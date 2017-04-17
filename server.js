import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import http from 'http';
import reload from 'reload';
import socketIO from 'socket.io';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import timeout from 'connect-timeout';
dotenv.config({ silent: true });

function haltOnTimedout(req, res, next) {
    if (!req.timedout) next()
}

let serverFolder = 'serverDist';
if (process.env.NODE_ENV !== 'production') {
    serverFolder = 'server';
}
// https://github.com/motdotla/dotenv/issues/114
const serverRoutes = require(`./app/${serverFolder}/routes/index`).default;
const handleSocket = require(`./app/${serverFolder}/socket`).default;

// connect to mongoDB database
mongoose.Promise = global.Promise;
const options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};
mongoose.connect(process.env.MONGODB_URI, options);

const app = express();
app.use(timeout('240s'));
app.use(express.static(path.join(__dirname, '/app/client/public')));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({
    limit: '20mb',
    extended: true
}));
app.use(haltOnTimedout);
// app.use(passport.initialize());

// app.use(flash()); // use connect-flash for flash messages stored in session
// using webpack-dev-server and middleware in development environment

const server = http.createServer(app);
const io = socketIO(server);
io.on('connection', handleSocket.bind(null, io));

if (process.env.NODE_ENV !== 'production') {
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpack = require('webpack');
    const config = require('./webpack.config.js');

    const compiler = webpack(config);

    const morgan = require('morgan');

    app.use(morgan('dev'));
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
    reload(server, app);
}

serverRoutes(app);

const PORT = process.env.PORT || 4545;
server.listen(PORT, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.info('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT);
    }
});

const CronJob = require('cron').CronJob;
const job = new CronJob(
    '00 00 00 * * 0-6',
    function() {
        /*
         * Runs every day
         * at 00:00:00 AM.
         */
        require('./scheduled-job')();
    },
    function() {
        /* This function is executed when the job stops */
        console.log('job stopped');
    },
    true /* Start the job right now */,
    'America/New_York' /* Time zone of this job. */
);
