require('babel-core/register');

var path = require('path');
require("dotenv").config();


const server_routes = require("./app/server/routes/index");

var express = require('express');
    
    // mongoose = require("mongoose"),
    // passport = require("passport"),
    // flash = require("connect-flash")
    // bodyParser = require("body-parser");

var app = express();

//mongoose.connect(process.env.MONGODB_URI);

var PORT = process.env.PORT || 8080;


app.use(express.static(path.join(__dirname, '/app/client/public')));

//app.use(passport.initialize());

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


server_routes(app);


app.listen(PORT, function(error) {
    if (error) {
        console.error(error);
    } else {
        console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    }
});
