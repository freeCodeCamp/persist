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

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _index = require('./app/server/routes/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import passport from 'passport';
// import flash from 'connect-flash';
if (process.env.NODE_ENV !== 'production') {
  // get environment variables
  _dotenv2.default.config();
}

// connect to mongoDB database
_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect(process.env.MONGODB_URI);

var app = (0, _express2.default)();

app.use(_express2.default.static(_path2.default.join(__dirname, '/app/client/public')));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));

// app.use(passport.initialize());

// app.use(flash()); // use connect-flash for flash messages stored in session
// using webpack-dev-server and middleware in development environment

var server = _http2.default.createServer(app);

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
  (0, _reload2.default)(server, app);
}

(0, _index2.default)(app);

var PORT = process.env.PORT || 4545;
server.listen(PORT, function (error) {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.', PORT, PORT);
  }
});
