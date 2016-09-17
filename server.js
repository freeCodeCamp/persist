import dotenv from 'dotenv';
import path from 'path';
import express from 'express';

// import mongoose from 'mongoose';
// import passport from 'passport';
// import flash from 'connect-flash';
// import bodyParser from 'body-parser';

import serverRoutes from './app/server/routes/index';

dotenv.config();

var app = express();

// mongoose.connect(process.env.MONGODB_URI);

var PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '/app/client/public')));

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

serverRoutes(app);

app.listen(PORT, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.info('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT);
    }
});
