# Autorelease Plugin: Core

An Autorelease plugin that runs core tasks before and after publishing to NPM.

This plugin contains the following Autorelease plugins and tasks:

- [plugin-pre](../autorelease-plugin-pre) - Resolves the next version from commit messages and prepares the release.
- [plugin-post](../autorelease-plugin-post) - Generates and saves the changelong.
- [task-verify-branch](../autorelease-task-verify-branch) - Verifies the git branch before releasing.
- [task-npm-publish](../autorelease-task-npm-publish) - Runs `npm publish` on the package.

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-plugin-core -D
```

Add the plugin to your `.autoreleaserc` config.

```json
{
  "plugins": [ "core" ]
}
```

When you are ready to release, run the following command:

```bash
autorelease verify pre publish post
```

### Config

This plugin adds the following configuration to the `.autoreleaserc`.

- `npmToken` - The npm token to add to the project `.npmrc`. This can also be specified through an environment variable `NPM_TOKEN`.
- `version` - This is the NPM package version to use as the "base". This version is bumped according to rules. Defaults to "latest" which is resolved against the registry.
- `prerelease` - When set, the version bump will be a prerelease instead of a normal release. Set this to a the string to use for the prerelease. For example, if this is set to `alpha`, the next version would be something like `1.0.0-alpha.0`.
- `tag` - The NPM dist-tag to publish under. By default this is `latest`.
- `gitRef` - When the package has no previous version, this git commit reference is used as the base.
- `preset` - The [conventional-changelog](http://ghub.io/conventional-changelog) format preset. This plugin does not install dependencies for any preset and they must be installed seperately. Values include `'angular', 'atom', 'codemirror', 'ember', 'eslint', 'express', 'jquery', 'jscs', 'jshint'`.
- `changelogFile` - The name of the file to prepend the changelog. If the file doesn't exist it is created. Defaults to `changelog.md`.

### Context

This plugin modifies context for future tasks by adding the following keys:

- `registry` - The NPM registry url to be published to.
- `latest` - The package object from last NPM publish. This will always be an object even if no latest version was found.
- `commits` - Array of parsed commits since the last release.
- `version` - An object representing the next version.
- `changelog` - The generated changelog as a string.

### Notes

This plugin internally uses [task-npm-registry](../autorelease-task-npm-registry) to get the publish registry url. That task requires that a registry url be listed in the `package.json` file. If there is no registry url a new version will not be published.

This plugin parses commits and automatically bumps the version according to the rules set by [task-resolve-version](../autorelease-task-resolve-version).

The `dryrun` option is respected and when set to true nothing will be written to the filesystem.
