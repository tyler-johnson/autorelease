# Autorelease

[![npm](https://img.shields.io/npm/v/autorelease.svg)](https://www.npmjs.com/package/autorelease) [![Build Status](https://travis-ci.org/tyler-johnson/autorelease.svg?branch=master)](https://travis-ci.org/tyler-johnson/autorelease)

**_Fully Automated NPM Publish._**

Publish quickly, often and consistently with Autorelease, which will automatically:

- **verify releases** before publishing to ensure consistency.
- **bump the version** in your package.json and publish to NPM.
- **generate changelogs** from your commit messages.
- **create git tags** and create releases on Github or your favorite git host.
- and anything else you can write a JavaScript function for.

Autorelease is highly configurable and works in any environment Node.js works in, including CI or from your local machine. Autorelease is designed for git and will work with many remote git providers, including Github and Gitlab.

To quickly get your project set up with Autorelease, run the following:

```js
npm i autorelease -g
autorelease setup
```

### Plugins

- [autorelease-plugin-github](http://ghub.io/autorelease-plugin-github) - Create releases on Github.
- [autorelease-plugin-travis](http://ghub.io/autorelease-plugin-travis) - Verify the release is in Travis CI.
- [autorelease-plugin-lerna](http://ghub.io/autorelease-plugin-lerna) - Publish [lerna](http://ghub.io/lerna) packages.
