# Autorelease Task: Write Changelog

An Autorelease task that prepends the newest changelog data to `changelog.md`.

This task is a part of [plugin-post](../autorelease-plugin-pre) and [plugin-core](../autorelease-plugin-core).

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-task-write-changelog -D
```

Add the task to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "post": ["write-changelog"]
  }
}
```

### Config

This task adds the following configuration to the `.autoreleaserc`.

- `changelogFile` - The name of the file to prepend the changelog. If the file doesn't exist it is created. Defaults to `changelog.md`.

### Context

This task does not modify context.

### Notes

This task requires changelog data to have been set by previous task. Use something like [task-generate-changelog](../autorelease-task-generate-changelog).

The `dryrun` option is respected and when set to true the changelog file will not be modified.

When this task is called directly, it returns the full path to the updated changelog file.
