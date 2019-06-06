'use strict';

const util = require('util');
const fs = require('fs');
const { PATHS } = require('./constants');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const getFile = path => readFile(path, 'utf8');
const getFiles = paths => Promise.all(paths.map(path => getFile(path)));
const createFile = (path, data) => writeFile(path, data, 'utf8');
const parseTemplates = (templates, userOpts) =>
  templates.map(template =>
    template
      .replace(/%SRC_DIR/g, userOpts.srcDir)
      .replace(/%BUILD_DIR/g, userOpts.buildDir)
      .replace(/%COMPONENT_DIR/g, userOpts.componentDir)
      .replace(/%ENTRY_FILE/g, userOpts.entryFile)
      .replace(/%HTML_TEMPLATE/g, userOpts.htmlTemplate)
  );

module.exports = async userOpts => {
  try {
    // Grab the template files
    const templatePaths = Object.values(PATHS).map(({ template }) => template);
    const templates = await getFiles(templatePaths);

    // Parse the templates using the user-provided options
    const [
      wpCommon,
      wpDev,
      wpProd,
      babelrc,
      browserslist,
      postCSS,
      tsConfig
    ] = parseTemplates(templates, userOpts);

    // Write the final config files to the users directory
    await Promise.all([
      createFile(PATHS.wpCommon.dest, wpCommon),
      createFile(PATHS.wpDev.dest, wpDev),
      createFile(PATHS.wpProd.dest, wpProd),
      createFile(PATHS.babelrc.dest, babelrc),
      createFile(PATHS.browserslist.dest, browserslist),
      createFile(PATHS.postCSS.dest, postCSS),
      createFile(PATHS.tsConfig.dest, tsConfig)
    ]);
  } catch (error) {
    throw new Error(error.message);
  }
};
