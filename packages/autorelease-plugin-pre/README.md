# Autorelease Plugin: Pre

An Autorelease plugin that runs core tasks before publishing to NPM.

This plugin contains the following Autorelease tasks:

- [task-configure-npm](../autorelease-task-configure-npm) - Configures NPM for release.
- [task-fetch-latest](../autorelease-task-fetch-latest) - Fetches the latest `package.json` from the NPM registry.
- [task-fetch-commits](../autorelease-task-fetch-commits) - Fetches all commits since the last publish.
- [task-resolve-version](../autorelease-task-resolve-version) - Determines the new version from the commit messages.
- [task-prep-publish](../autorelease-task-prep-publish) - Prepares the package for publish.

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-plugin-pre -D
```

Add the plugin to your `.autoreleaserc` config.

```json
{
  "plugins": [ "pre" ]
}
```

When you are ready to release, run the following command:

```bash
autorelease pre
```

### Config

This plugin adds the following configuration to the `.autoreleaserc`.

- `npmToken` - The npm token to add to the project `.npmrc`. This can also be specified through an environment variable `NPM_TOKEN`.
- `version` - This is the NPM package version to use as the "base". This version is bumped according to rules. Defaults to "latest" which is resolved against the registry.
- `prerelease` - When set, the version bump will be a prerelease instead of a normal release. Set this to a the string to use for the prerelease. For example, if this is set to `alpha`, the next version would be something like `1.0.0-alpha.0`.
- `tag` - The NPM dist-tag to publish under. By default this is `latest`.
- `gitRef` - When the package has no previous version, this git commit reference is used as the base.

### Context

This plugin modifies context for future tasks by adding the following keys:

- `registry` - The NPM registry url to be published to.
- `latest` - The package object from last NPM publish. This will always be an object even if no latest version was found.
- `commits` - Array of parsed commits since the last release.
- `version` - An object representing the next version.

### Notes

This plugin internally uses [task-npm-registry](../autorelease-task-npm-registry) to get the publish registry url. That task requires that a registry url be listed in the `package.json` file. If there is no registry url a new version will not be published.

This plugin parses commits and automatically bumps the version according to the rules set by [task-resolve-version](../autorelease-task-resolve-version).

The `dryrun` option is respected and when set to true nothing will be written to the filesystem.
