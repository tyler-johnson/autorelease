# Autorelease

[![npm](https://img.shields.io/npm/v/autorelease.svg)](https://www.npmjs.com/package/autorelease) [![Build Status](https://travis-ci.org/tyler-johnson/autorelease.svg?branch=master)](https://travis-ci.org/tyler-johnson/autorelease)

**_Fully Automated NPM Publish._**

Publish quickly, often and consistently with Autorelease, which can automatically:

- **verify releases** before publishing to ensure consistency.
- **bump the version** in your package.json and publish to NPM.
- **generate changelogs** from your commit messages.
- **create git tags** and create releases on Github or your favorite git host.
- and anything else you can write a JavaScript function for.

To quickly get your project set up with Autorelease, run the following:

```js
npm i autorelease -g
autorelease setup
```

### How do I use Autorelease with ...?

These are some tutorials on configuring Autorelease for popular environments.

- [Github + Travis CI](tutorials/github-travis.md)
- [Gitlab + Gitlab CI]()
- [Local Command Line]()

### Plugins

These are some of the plugins available for autorelease. [See NPM for a more complete list.](https://www.npmjs.com/browse/keyword/autorelease)

- [autorelease-plugin-pre](packages/autorelease-plugin-pre) - The `pre` pipeline that bumps the version based on commit messages.
- [autorelease-plugin-post](packages/autorelease-plugin-post) - The `post` pipeline that generates the changelog and creates a git tag.
- [autorelease-plugin-core](packages/autorelease-plugin-core) - An all-in-one plugin that includes plugin-pre, plugin-post, [task-verify-branch](./packages/autorelease-task-verify-branch) and [task-npm-publish](./packages/autorelease-task-npm-publish).
- [autorelease-plugin-github](packages/autorelease-plugin-github) - Create releases and upload changelogs to Github.
- [autorelease-plugin-travis](packages/autorelease-plugin-travis) - Run Autorelease inside a Travis CI environment.
- [autorelease-plugin-lerna](packages/autorelease-plugin-lerna) - Publish [lerna](http://ghub.io/lerna) packages.
