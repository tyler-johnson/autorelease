# Autorelease Task: Prep Publish

An Autorelease task that preps the `package.json` for NPM publish.

This task is a part of [plugin-pre](../autorelease-plugin-pre) and [plugin-core](../autorelease-plugin-core).

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-task-prep-publish -D
```

Add the tasks to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "pre": ["prep-publish"]
  }
}
```

### Config

This task adds the following configuration to the `.autoreleaserc`.

- `tag` - The NPM dist-tag to publish under. By default this is `latest`.

### Context

This task does not modify context.

### Notes

This task will add the new package version to the `package.json` file. A task like [task-resolve-version](../autorelease-task-resolve-version) should be run prior to this one to generate the new version. If no new version is specified this package will remove the version from the `package.json` altogether, preventing `npm publish` from being successful.

The `dryrun` option is respected and when set to true the `package.json` file will not be updated.

When this task is called directly, it returns the updated `package.json` as an object.
