const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

const SRC_DIR = path.join(__dirname, '%SRC_DIR');
const BUILD_DIR = path.join(__dirname, '%BUILD_DIR');
const HTML_TEMPLATE = '%HTML_TEMPLATE';
const { PORT } = process.env;

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // Serve content from this directory
    contentBase: BUILD_DIR,
    // Enable HMR
    hot: true,
    // Enable gzip compression for everything served
    compress: true,
    // Supress the extensive stats normally printed after a dev build
    stats: 'minimal',
    // Suppress forwarding of Webpack logs to the browser console
    clientLogLevel: 'none',
    port: PORT || 8000,
    // Request that paths not ending in a file extension serve index.html
    historyApiFallback: true,
    // Don't embed an error overlay into the client bundle
    overlay: false
  },
  plugins: [
    // Inject bundled assets into the `HTML_TEMPLATE`
    new HtmlWebpackPlugin({
      template: path.join(SRC_DIR, HTML_TEMPLATE)
    }),
    // Enable HMR
    new webpack.HotModuleReplacementPlugin()
  ]
});
