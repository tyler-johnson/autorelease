# Autorelease Task: Git Tag

An Autorelease task that creates a git tag at the `HEAD` commit using the newest package version.

This task is a part of [plugin-post](../autorelease-plugin-post) and [plugin-core](../autorelease-plugin-core).

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-task-git-tag -D
```

Add the task to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "verify": ["git-tag"]
  }
}
```

### Config

This task does not add any configuration to the `.autoreleaserc`.

### Context

This task does not modify the context.

### Notes

This task requires a new version to create a git tag from. This version should be set in the `package.json` (via [task-prep-publish](../autorelease-task-prep-publish)) or can come from the `version` context property (via [task-resolve-version](../autorelease-task-resolve-version)).

The `dryrun` option is respected and when set to true a new git tag will not be created.

When this task is called directly, it returns the name of the git tag that was created.
