'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _index = require('./app/server/routes/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

// import mongoose from 'mongoose';
// import passport from 'passport';
// import flash from 'connect-flash';
// import bodyParser from 'body-parser';

var app = (0, _express2.default)();

// mongoose.connect(process.env.MONGODB_URI);

var PORT = process.env.PORT || 8080;

app.use(_express2.default.static(_path2.default.join(__dirname, '/app/client/public')));

// app.use(passport.initialize());

// app.use(flash()); // use connect-flash for flash messages stored in session
// using webpack-dev-server and middleware in development environment

if (process.env.NODE_ENV !== 'production') {
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpack = require('webpack');
    var config = require('./webpack.config.js');

    var compiler = webpack(config);

    var morgan = require('morgan');

    app.use(morgan('dev'));
    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));
    app.use(webpackHotMiddleware(compiler));
}

(0, _index2.default)(app);

app.listen(PORT, function (error) {
    if (error) {
        console.error(error);
    } else {
        console.info('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT);
    }
});
