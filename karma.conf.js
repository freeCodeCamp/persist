const webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  process.env.NODE_ENV = 'test';
  config.set({
    autowatch: false,
    browsers: ['PhantomJS'],
    browserNoActivityTimeout: 10000,
    browserConsoleLogOptions: {
      terminal: false,
      path: 'karma.log',
      level: ''
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
      'node_modules/json2csv/dist/json2csv.js',
      'test/client/**/*_test.js',
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
      'karma-sinon',
      'karma-coverage-istanbul-reporter'
    ],
    preprocessors: {
      'test/client/**/*_test.js': [
        'webpack', 'sourcemap',
      ],
      'test/client/**/*_test.jsx': [
        'webpack', 'sourcemap',
      ]
    },
    reporters: [
      'mocha', 'coverage-istanbul'
    ],
    coverageIstanbulReporter: {
      reports: [
        'html', 'text-summary'
      ],
      dir: 'test/client/coverage',
      fixWebpackSourcePaths: true,
      skipFilesWithNoCoverage: true,
      'report-config': {
        html: {
          subdir: 'html'
        }
      }
    },
    singleRun: true,
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    }
  });
};
