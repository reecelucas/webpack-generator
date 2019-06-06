
# Webpack Generator

A simple node CLI to bootstrap a [Webpack](https://webpack.js.org/) project with sane defaults.

The generated config assumes a `React`, `TypeScript` & `CSS Modules` stack, but it can be easily modified. The goal here is to remove a lot of the boilerplate that's often required when starting a new project.

## Getting Started

```bash
git clone git@github.com:reecelucas/webpack-generator.git
cd webpack-generator
npm install -g
```

You can now run `wp-generate` at the root of any new project. Doing so will install the required dependencies and generate several configuration files:

- `webpack.common.js`
- `webpack.dev.js`
- `webpack.prod.js`
- `.babelrc`
- `.browserslistrc`
- `postcss.config.js`
- `tsconfig.js`

If the project does not yet include a `package.json` file it will be created. `wp-generate` will determine whether to use `npm` or `yarn` to install dependencies (based on the presence/absence of a `yarn.lock` file).

The generated build config supports `TypeScript`, `ecma2018+`, `React`, `SASS`, `CSS Modules` and `image loading`.

## Build Scripts

Make sure the following scripts are added to your `package.json`:

```json
"start": "webpack-dev-server --config webpack.dev.js",
"build": "NODE_ENV=production webpack --config webpack.prod.js",
"serve": "serve {build_dir}"
```

## Hot Module Replacement (HMR)

To enable HMR for React, run the following:

```bash
yarn add -D react-hot-loader
```

And add the following to the end of your entry file:

```js
if (process.env.NODE_ENV !== "production" && module && (module as any).hot) {
  (module as any).hot.accept();
}
```

## Production Optimisations

In addition to the usual stuff, the following optimisations are made during production builds:

- Removal of unused CSS (using [`purgeCSS`](https://www.purgecss.com/with-webpack))
- Inlining of critical CSS (using [`critters`](https://github.com/GoogleChromeLabs/critters))

## Bundle Information

You can access bundle information (generated by [`webpack-bundle-analyzer`](https://github.com/webpack-contrib/webpack-bundle-analyzer)) in production builds by visiting: `http://localhost:5000/report`.

## Polyfilling

`webpack-generator` uses `core-js/stable`, `regenerator-runtime/runtime` and `@babel/preset-env`
to generate the necessary ecma2015+ polyfills based on the target environments specified in the `.browserslistrc`
file. The default configuration sets the "`useBuiltIns`" option of `@babel/preset-env` to "`usage`" which
means that during babel transformation the polyfills needed are included as imports at the top of each
file. For a further explanation of this approach (and alternative approaches) see <https://github.com/zloirock/core-js#babelpreset-env>.

This approach to polyfilling is fairly coarse since the polyfills that are generated will be included
for all browsers, regardless of whether a user's specific browser needs all (or any) of them.
E.g. If you use `string.startsWith` and need IE/Edge support your bundle will include the
`core-js/es6/string` polyfill which is unnecessary in Chrome, Firefox, Safari, etc. An alternative is to
dynamically import the polyfills if required, using Webpack's `import()` syntax:

```js
// .babelrc
"useBuiltIns": false, // Stop babel doing anything clever with polyfills

// polyfills.js
require('core-js/es6/string'); // Specify only what's needed

// index.js
const render = () => 'render app!';

if (
  'startsWith' in String.prototype &&
  'endsWith' in String.prototype
) {
  render();
} else {
  import('./polyfills').then(render);
}
```

When this code runs in the browser, the Webpack runtime will handle the loading of the polyfill
packages and then render our app. For a full explanation see <https://hackernoon.com/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758#29a8>.
