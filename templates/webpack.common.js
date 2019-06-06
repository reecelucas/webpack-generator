const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProd = process.env.NODE_ENV === 'production';

const SRC_DIR = path.resolve(__dirname, '%SRC_DIR');
const BUILD_DIR = path.resolve(__dirname, '%BUILD_DIR');
const COMPONENT_DIR = path.resolve(__dirname, '%SRC_DIR/%COMPONENT_DIR');
const ENTRY_FILE = '%ENTRY_FILE';

module.exports = {
  // Webpack outputs a file called `main` for single entry points
  entry: path.join(SRC_DIR, ENTRY_FILE),
  // Limit the amount of information shown during the build
  stats: 'minimal',
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(m?)js(x?)$/,
        exclude: /(node_modules|bower_components)/,
        // babel-loader uses the `.babelrc` file in the project root
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.ts(x?)$/,
        exclude: /(node_modules|bower_components)/,
        // `awesome-typescript-loader` uses the `tsconfig.json` file in the project root
        use: [{ loader: 'awesome-typescript-loader' }]
      },
      {
        test: /\.(jp(e?)g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:5].[ext]'
            }
          }
        ]
      },
      {
        // SCSS gets preprocessed, then treated like any other CSS
        test: /\.(scss|sass)$/,
        loader: 'sass-loader',
        // Ensure SCSS compilation happens first
        enforce: 'pre'
      },
      {
        // Process non-modular CSS everywhere except `COMPONENT_DIR`
        test: /\.(scss|sass|css)$/,
        exclude: [COMPONENT_DIR],
        use: [
          // In prod, CSS is extracted to files on disk. In dev, it's inlined into a <style> tag
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            // Translate CSS into CommonJS
            loader: 'css-loader',
            options: {
              sourceMap: isProd
            }
          },
          // Transform CSS with PostCSS
          'postcss-loader'
        ]
      },
      {
        // Only enable CSS Modules within `COMPONENT_DIR`
        test: /\.(scss|sass|css)$/,
        include: [COMPONENT_DIR],
        use: [
          // In prod, CSS is extracted to files on disk. In dev, it's inlined into a <style> tag
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            // Translate CSS into CommonJS
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: isProd
                ? '[hash:base64:5]'
                : '[local]__[hash:base64:5]',
              camelCase: true,
              importLoaders: 1,
              sourceMap: isProd
            }
          },
          // Transform CSS with PostCSS
          'postcss-loader'
        ]
      }
    ]
  },
  resolve: {
    // Update the file types that can be resolved by Webpack
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css']
  }
};
