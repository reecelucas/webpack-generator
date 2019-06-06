const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./webpack.common.js');
const glob = require('glob');
const Critters = require('critters-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const SRC_DIR = path.join(__dirname, '%SRC_DIR');
const BUILD_DIR = path.join(__dirname, '%BUILD_DIR');
const HTML_TEMPLATE = '%HTML_TEMPLATE';

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: BUILD_DIR,
    filename: '[name].[chunkhash:5].js'
  },
  plugins: [
    // Remove contents of the `BUILD_DIR` directory before each build
    new CleanWebpackPlugin(),
    // Show a pretty progress bar showing build progress
    new ProgressBarPlugin({
      format: `\u001b[90m\u001b[44mBuild\u001b[49m\u001b[39m [:bar] \u001b[32m\u001b[1m:percent\u001b[22m\u001b[39m (:elapseds) \u001b[2m:msg\u001b[22m\r`,
      renderThrottle: 100,
      summary: false,
      clear: true
    }),
    // Inject bundled assets into the `HTML_TEMPLATE`
    new HtmlWebpackPlugin({
      // To pre-render the application append `!!prerender-loader?string!` to the
      // template path (https://github.com/GoogleChromeLabs/prerender-loader)
      template: path.join(SRC_DIR, HTML_TEMPLATE),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    // Fingerprint the extracted stylesheet during production builds
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:5].css',
      chunkFilename: '[name].[contenthash:5].css'
    }),
    // Remove unused selectors from the CSS; may necessitate maintaining a selector whitelist
    new PurgecssPlugin({
      paths: glob.sync(path.join(SRC_DIR, '**/*'), { nodir: true }),
      // We're generating unique class names at build time, using CSS Modules.
      // PurgeCSS works by parsing our markup & components to identify what selectors
      // are present. Because our components don't reference the generated classes
      // (instead referencing `styles.{className}`), PurgeCSS considers them unused and
      // removes them completely. We therefore whitelist generated classes (which start
      // with a single leading underscore)
      whitelistPatterns: [/^_/]
    }),
    // Inline critical CSS and lazy-load the rest
    new Critters({
      // Use <link rel="stylesheet" media="not x" onload="this.media='all'">
      // hack to load async css
      preload: 'media',
      // Inline all styles from any stylesheet below this size
      inlineThreshold: 2000,
      // Don't bother lazy-loading non-critical stylesheets below this size,
      // just inline the non-critical styles too
      minimumExternalSize: 5000,
      // Don't emit <noscript> external stylesheet links since the app requires JS anyway
      noscriptFallback: false
    }),
    // Output module size analysis to `BUILD_DIR/report.html`
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      defaultSizes: 'gzip',
      openAnalyzer: false
    }),
    // Fix content-based hashing: https://webpack.js.org/guides/caching#module-identifiers
    new webpack.HashedModuleIdsPlugin()
  ],
  optimization: {
    // Minify JS and CSS
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    // Output a separate bundle containing only the Webpack runtime
    runtimeChunk: 'single',
    // Output a separate bundle containing only vendor code
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
});
