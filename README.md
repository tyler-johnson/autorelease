# Autorelease

[![npm](https://img.shields.io/npm/v/autorelease.svg)](https://www.npmjs.com/package/autorelease) [![Build Status](https://travis-ci.org/tyler-johnson/autorelease.svg?branch=master)](https://travis-ci.org/tyler-johnson/autorelease)

**_Fully Automated NPM Publish._**

Publish quickly, often and consistently with Autorelease, which can automatically:

- **verify releases** before publishing to ensure consistency.
- **bump the version** in your package.json and publish to NPM.
- **generate changelogs** from your commit messages.
- **create git tags** and create releases on Github or your favorite git host.
- and anything else you can write a JavaScript function for.

### How do I use Autorelease with ...?

These are some tutorials on configuring Autorelease for popular environments.

- [Github + Travis CI](docs/tutorials/github-travis.md)
- [Gitlab + Gitlab CI]()
- [Local Command Line]()

### Plugins

These are some of the plugins available for autorelease. [See NPM for a more complete list.](https://www.npmjs.com/browse/keyword/autorelease)

| Name | Description |
| --- | --- |
| [core](packages/autorelease-plugin-core) | All of the main tasks for releasing from the command line. |
| [pre](packages/autorelease-plugin-pre) | Bumps the version based on commit messages and preps the package. |
| [post](packages/autorelease-plugin-post) | Generates the changelog file and creates a git tag. |
| [github](packages/autorelease-plugin-github) | Create releases and upload changelogs to Github. |
| [travis](packages/autorelease-plugin-travis) | Autorelease from a Travis CI environment. |
| [lerna](packages/autorelease-plugin-lerna) | Integration with [lerna](http://ghub.io/lerna) packages. |
