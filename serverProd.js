'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _reload = require('reload');

var _reload2 = _interopRequireDefault(_reload);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _connectTimeout = require('connect-timeout');

var _connectTimeout2 = _interopRequireDefault(_connectTimeout);

var _scheduledJob = require('./scheduled-job');

var _scheduledJob2 = _interopRequireDefault(_scheduledJob);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

_dotenv2.default.config({ silent: true });

function haltOnTimedout(req, res, next) {
    if (!req.timedout) next();
}

var serverFolder = 'serverDist';
if (process.env.NODE_ENV !== 'production') {
    serverFolder = 'server';
}
// https://github.com/motdotla/dotenv/issues/114
var serverRoutes = require('./app/' + serverFolder + '/routes/index').default;
var handleSocket = require('./app/' + serverFolder + '/socket').default;

// connect to mongoDB database
_mongoose2.default.Promise = global.Promise;
var options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};
_mongoose2.default.connect(process.env.MONGODB_URI, options);

var app = (0, _express2.default)();
app.use((0, _connectTimeout2.default)('240s'));
app.use(_express2.default.static(_path2.default.join(__dirname, '/app/client/public')));
app.use(_bodyParser2.default.json({ limit: '20mb' }));
app.use(
    _bodyParser2.default.urlencoded({
        limit: '20mb',
        extended: true
    })
);
app.use(haltOnTimedout);
// app.use(passport.initialize());

// app.use(flash()); // use connect-flash for flash messages stored in session
// using webpack-dev-server and middleware in development environment

var server = _http2.default.createServer(app);
var io = (0, _socket2.default)(server);
io.on('connection', handleSocket.bind(null, io));

if (process.env.NODE_ENV !== 'production') {
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpack = require('webpack');
    var config = require('./webpack.config.js');

    var compiler = webpack(config);

    var morgan = require('morgan');

    app.use(morgan('dev'));
    app.use(
        webpackDevMiddleware(compiler, {
            noInfo: true,
            publicPath: config.output.publicPath
        })
    );
    app.use(webpackHotMiddleware(compiler));
    (0, _reload2.default)(server, app);
}

serverRoutes(app);

var PORT = process.env.PORT || 4545;
server.listen(PORT, function(error) {
    if (error) {
        console.error(error);
    } else {
        console.info('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT);
    }
});

var CronJob = require('cron').CronJob;
var job = new CronJob(
    '00 00 00 * * 0-6',
    function() {
        /*
     * Runs every day
     * at 00:00:00 AM.
     */
        (0, _scheduledJob2.default)();
    },
    function() {
        /* This function is executed when the job stops */
        console.log('job stopped');
    },
    true /* Start the job right now */,
    'America/New_York' /* Time zone of this job. */
);
