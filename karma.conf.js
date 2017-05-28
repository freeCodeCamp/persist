const webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  process.env.NODE_ENV = 'test';
  config.set({
    autowatch: false,
    browsers: ['PhantomJS'],
    browserNoActivityTimeout: 10000,
    browserConsoleLogOptions: {
      terminal: true,
      level: '',
    },
    client: {
      captureConsole: true,
      mocha: {
        bail: true,
        timeout: '5000'
      }
    },
    coverageReporter: {
      dir: 'test/client/coverage/',
      reporters: [
        {
          type: 'html',
          subdir: 'html'
        }, {
          type: 'text-summary'
        }
      ]
    },
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'test/client/**/*_test.js',
      'tests/client/**/*_test.jsx'
    ],
    frameworks: [
      'mocha', 'sinon'
    ],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-coverage',
      'karma-mocha-reporter',
      'karma-sinon'
    ],
    preprocessors: {
      'test/client/**/*_test.js': [
        'webpack', 'sourcemap', //'coverage',
      ],
      'test/client/**/*_test.jsx': [
        'webpack', 'sourcemap', //'coverage',
      ]
    },
    reporters: [
      'mocha', 'coverage'
    ],
    singleRun: true,
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    }
  });
};
