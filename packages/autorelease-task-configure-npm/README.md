# Autorelease Task: Configure NPM

An Autorelease task that creates a project level `.npmrc` file and adds an NPM auth token. This will authenticate future calls to the NPM cli.

This task is a part of [plugin-pre](../autorelease-plugin-pre) and [plugin-core](../autorelease-plugin-core).

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-task-configure-npm -D
```

Add the task to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "pre": ["configure-npm"]
  }
}
```

### Config

This task adds the following configuration to the `.autoreleaserc`.

- `npmToken` - The npm token to add to the project `.npmrc`. This can also be specified through an environment variable `NPM_TOKEN`. If there is no npm token, this task does nothing.

### Context

This task modifies context for future tasks by adding the following key:

- `registry` - The NPM registry url to be published to. This key is added by [task-npm-registry](../autorelease-task-npm-registry).

### Notes

This task internally uses [task-npm-registry](../autorelease-task-npm-registry) to get the publish registry url. That task requires that a registry url be listed in the `package.json` file. If there is no registry url this task does nothing.

The `dryrun` option is respected and when set to true the `.npmrc` file will not be written.

When this task is called directly, it returns `undefined` or the full path to the `.npmrc` file.
