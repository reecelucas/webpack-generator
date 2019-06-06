#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const inquirer = require('inquirer');
const createConfigFiles = require('./createConfigFiles');
const installDeps = require('./installDeps');
const log = console.log;

const questions = [
  {
    type: 'input',
    name: 'srcDir',
    message: 'Source directory',
    default: 'src'
  },
  {
    type: 'input',
    name: 'buildDir',
    message: 'Build directory',
    default: 'dist'
  },
  {
    type: 'input',
    name: 'componentDir',
    message: 'Component directory',
    default: 'components'
  },
  {
    type: 'input',
    name: 'entryFile',
    message: 'Entry point',
    default: 'index.tsx',
    validate: value =>
      /\.(js|jsx|mjs|ts|tsx)$/.test(value) ||
      'Invalid file extension. Supported extensions: .js, .jsx, .mjs, .ts, .tsx'
  },
  {
    type: 'input',
    name: 'htmlTemplate',
    message: 'HTML template',
    default: 'index.html',
    validate: value => /\.html$/.test(value) || 'Invalid file extension'
  }
];

(async () => {
  try {
    // Handle CLI input
    log(chalk.blue('Configure directory structure'));
    const options = await inquirer.prompt(questions);

    // Create config files & install dependencies
    await Promise.all([createConfigFiles(options), installDeps(options)]);
    log(chalk.green(`✅ You're good to go!`));
    log(chalk.blue(`Paste the following scripts in your package.json file:`));
    log(
      chalk.cyan(`
        "start": "webpack-dev-server --config webpack.dev.js",
        "build": "NODE_ENV=production webpack --config webpack.prod.js",
        "serve": "serve ${options.buildDir}"
      `)
    );
  } catch (error) {
    log(chalk.red(error));
    process.exit(1);
  }
})();
