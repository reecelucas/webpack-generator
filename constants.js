const path = require('path');

const DEPENDENCIES = ['react', 'react-dom', 'core-js', 'regenerator-runtime'];
const DEV_DEPENDENCIES = [
  '@babel/core',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/preset-env',
  '@babel/preset-react',
  '@types/react',
  '@types/react-dom',
  '@types/webpack',
  '@types/webpack-env',
  'autoprefixer',
  'awesome-typescript-loader',
  'babel-loader',
  'clean-webpack-plugin',
  'critters-webpack-plugin',
  'css-loader',
  'file-loader',
  'html-webpack-plugin',
  'mini-css-extract-plugin',
  'node-sass',
  'optimize-css-assets-webpack-plugin',
  'postcss-loader',
  'prerender-loader',
  'progress-bar-webpack-plugin',
  'purgecss-webpack-plugin',
  'sass-loader',
  'serve',
  'style-loader',
  'terser-webpack-plugin',
  'typescript',
  'webpack',
  'webpack-bundle-analyzer',
  'webpack-cli',
  'webpack-dev-server',
  'webpack-merge'
];
const PATHS = {
  wpCommon: {
    template: path.resolve(__dirname, 'templates/webpack.common.js'),
    dest: path.resolve(process.cwd(), 'webpack.common.js')
  },
  wpDev: {
    template: path.resolve(__dirname, 'templates/webpack.dev.js'),
    dest: path.resolve(process.cwd(), 'webpack.dev.js')
  },
  wpProd: {
    template: path.resolve(__dirname, 'templates/webpack.prod.js'),
    dest: path.resolve(process.cwd(), 'webpack.prod.js')
  },
  babelrc: {
    template: path.resolve(__dirname, 'templates/.babelrc'),
    dest: path.resolve(process.cwd(), '.babelrc')
  },
  browserslist: {
    template: path.resolve(__dirname, 'templates/.browserslistrc'),
    dest: path.resolve(process.cwd(), '.browserslistrc')
  },
  postCSS: {
    template: path.resolve(__dirname, 'templates/postcss.config.js'),
    dest: path.resolve(process.cwd(), 'postcss.config.js')
  },
  tsConfig: {
    template: path.resolve(__dirname, 'templates/tsconfig.json'),
    dest: path.resolve(process.cwd(), 'tsconfig.json')
  }
};

module.exports = {
  DEPENDENCIES,
  DEV_DEPENDENCIES,
  PATHS
};
