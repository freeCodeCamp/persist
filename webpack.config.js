const webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './app/client/src/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
      loaders: [
          {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel',
              query: {
                  presets: ['es2015', 'react', 'react-hmre', 'stage-0']
              }
          },
          {
              test: /\.scss$/,
              loaders: ['style', 'css', 'sass']
          }
      ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
