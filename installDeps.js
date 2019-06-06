'use strict';

const chalk = require('chalk');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');
const writePackage = require('write-pkg');
const { DEPENDENCIES, DEV_DEPENDENCIES } = require('./constants');
const log = console.log;

const hasFile = file => fs.existsSync(path.resolve(process.cwd(), file));
const getDirName = (dir = process.cwd()) => dir.split(path.sep).pop();

const getInstallCommand = (deps, { save = false } = {}) =>
  hasFile('yarn.lock')
    ? `yarn add ${deps} ${save ? '' : '-D'}`
    : `npm install ${deps} ${save ? '-S' : '-D'}`;

const runCommand = async cmd => {
  try {
    return await exec(cmd);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = async userOpts => {
  // Create a package.json file if there isn't one
  if (!hasFile('package.json')) {
    try {
      log(chalk.blue('Creating package.json file...'));

      await writePackage({
        name: `${getDirName()}`,
        version: '1.0.0',
        description: 'File created by wp-generate',
        main: `${userOpts.entryFile}`,
        license: 'ISC'
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Install required dependencies
  try {
    log(chalk.blue('Installing dependencies...'));
    await runCommand(getInstallCommand(DEPENDENCIES.join(' '), { save: true }));
    await runCommand(getInstallCommand(DEV_DEPENDENCIES.join(' ')));
  } catch (error) {
    throw new Error(error.message);
  }
};
