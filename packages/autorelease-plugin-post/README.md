# Autorelease Plugin: Post

An Autorelease plugin that runs core tasks after publishing to NPM.

This plugin contains the following Autorelease tasks:

- [generate-changelog](../autorelease-task-generate-changelog) - Generates a changelog from the commit messages.
- [write-changelog](../autorelease-task-write-changelog) - Writes the generated changelog to `changelog.md`.
- [git-tag](../autorelease-task-git-tag) - Create a new git tag with the version at the current commit.

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-plugin-post -D
```

Add the plugin to your `.autoreleaserc` config.

```json
{
  "plugins": [ "post" ]
}
```

### Config

This plugin adds the following configuration to the `.autoreleaserc`.

- `preset` - The [conventional-changelog](http://ghub.io/conventional-changelog) format preset. This plugin does not install dependencies for any preset and they must be installed seperately. Values include `'angular', 'atom', 'codemirror', 'ember', 'eslint', 'express', 'jquery', 'jscs', 'jshint'`.
- `changelogFile` - The name of the file to prepend the changelog. If the file doesn't exist it is created. Defaults to `changelog.md`.

### Context

This plugin modifies context for future tasks by adding the following keys:

- `changelog` - The generated changelog as a string.

### Notes

If [task-fetch-commits](../autorelease-task-fetch-commits) was run before this plugin, then those commits are parsed and used for the changelog. Otherwise, this plugin will call task-fetch-commits internally to get the commit messages.

This plugin requires a new version to create a git tag from. This version should be set in the `package.json` (via [task-prep-publish](../autorelease-task-prep-publish)) or can come from the `version` context property (via [task-resolve-version](../autorelease-task-resolve-version)).

The `dryrun` option is respected and when set to true nothing will be written to the filesystem.
