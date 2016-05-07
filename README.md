# Autorelease

[![npm](https://img.shields.io/npm/v/autorelease.svg)](https://www.npmjs.com/package/autorelease) [![David](https://img.shields.io/david/tyler-johnson/autorelease.svg)](https://david-dm.org/tyler-johnson/autorelease) [![Build Status](https://travis-ci.org/tyler-johnson/autorelease.svg?branch=master)](https://travis-ci.org/tyler-johnson/autorelease)

This is a tool to facilitate the releasing of NPM packages based on Git commit messages. This tool is designed to handled all aspects of publishing Node modules, including:

- Release verification to ensure the environment is configured correctly before publishing.
- Bumping package versions using semver according to commit types.
- Generating changelogs from commit messages.
- Tagging the commit in Git with the new version.

This is tool is highly configurable and can be adapted using plugins for almost any environment.

This is very similar to [semantic-release](http://ghub.io/semantic-release), but *it is much less opinionated*. By default, this library does not assume you are using any specific remote git repository host or continuous integration platform. You can configure this tool to work with the environment of your choosing.

## Install

Install using NPM:

```bash
npm i autorelease --save-dev
```

You can also easily setup your package for Github or Gitlab using the [`autorelease-setup`](http://ghub.io/autorelease-setup) cli. That will take you through a series of prompts and install the correct autorelease packages, including plugins.

```bash
npm i autorelease-setup -g
autorelease-setup
```

## Basic Usage

This CLI tool is split into two parts, a before release (pre) stage and an after release (post) stage, each with a series of steps. The before release sets up the repository for release, including release verification, bumping the version number and configuring NPM. The after release stage handles changelog generation and git tagging. The steps in these stages can be configured using the `.autoreleaserc` file.

To release a module using this tool, add the following to you `package.json` after installing.

```json
{
	"scripts": {
		"autorelease": "autorelease pre && npm publish && autorelease post"
	}
}
```

You will also need to generate an NPM token, either by using `npm login` or with a package like [`get-npm-token`](http://ghub.io/get-npm-token). Set the token to the `NPM_TOKEN` environment variable.

```bash
export NPM_TOKEN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```

Now you can release your package from the command line with:

```bash
npm run autorelease
```

## Plugins

There are currently a handful of plugins for Autorelease to configure it for common environments.

- [autorelease-github](http://ghub.io/autorelease-github) - Publish changelog and tag version using Github releases.
- [autorelease-travis](http://ghub.io/autorelease-travis) - Only allows releases in a Travis CI environment.
- [autorelease-gitlab](http://ghub.io/autorelease-gitlab) - Only allows releases in a Gitlab CI environment. Also publishes changelog using Gitlab tags.
- [autorelease-gemfury](http://ghub.io/autorelease-gemfury) - Configures the package for a Gemfury release.
