# Autorelease Task: NPM Publish

An Autorelease task that runs `npm publish` on the package.

This task is a part of [plugin-core](../autorelease-plugin-core).

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-task-npm-publish -D
```

Add the task to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "publish": ["npm-publish"]
  }
}
```

### Config

This task does not add any configuration to the `.autoreleaserc`.

### Context

This task does not modify the context.

### Notes

This task requires a new version to be set in the `package.json`. This can be done using a task like [task-prep-publish](../autorelease-task-prep-publish).

The `dryrun` option is respected and when set to true no npm publish will take place.

When this task is called directly, it returns the stdout of the `npm publish` command.
