# Autorelease Task: Generate Changelog

An Autorelease task that generates a changelog from commit messages. This uses parts of [conventional-changelog](http://ghub.io/conventional-changelog) allowing for greater control over changlog format.

This task only generates changelog strings, it does not save them anywhere. For that you will need a task like [task-write-changelog](../autorelease-task-write-changelog).

This task is a part of [plugin-post](../autorelease-plugin-post) and [plugin-core](../autorelease-plugin-core).

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-task-write-changelog -D
```

Add the task to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "post": ["generate-changelog"]
  }
}
```

### Config

This task adds the following configuration to the `.autoreleaserc`.

- `preset` - The [conventional-changelog](http://ghub.io/conventional-changelog) format preset. This task does not install dependencies for any preset and they must be installed seperately. Values include `'angular', 'atom', 'codemirror', 'ember', 'eslint', 'express', 'jquery', 'jscs', 'jshint'`.

### Context

This task modifies context for future tasks by adding the following key:

- `changelog` - The generated changelog as a string.

### Notes

If [task-fetch-commits](../autorelease-task-fetch-commits) was run before this task, then those commits are parsed and used for the changelog. Otherwise, this task will call task-fetch-commits internally to get the commit messages.

The `package.json` file should have a version number (usually persisted with a task like [task-prep-publish](../autorelease-task-prep-publish)). The version is used in the changelog as the title.

When this task is called directly, it returns the generated changelog as a string.
