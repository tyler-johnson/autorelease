# Autorelease Task: Fetch Latest

An autorelease task that fetches the latest `package.json` from the NPM registry.

This task is a part of [plugin-pre](../autorelease-plugin-pre) and [plugin-core](../autorelease-plugin-core).

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-task-fetch-latest -D
```

Add the tasks to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "pre": ["fetch-latest"]
  }
}
```

### Config

This task adds the following configuration to the `.autoreleaserc`.

- `version` - This is the NPM package version to look for in the registry. Defaults to `"latest"`. This will look in `dist-tags` and then `versions` for a match.
- `tag` - Adds support for the [task-prep-publish](../autorelease-task-prep-publish) `tag` config. If the main version is not found in the registry, this tag is used instead.

### Context

This task modifies context for future tasks by adding the following key:

- `latest` - The package object from last NPM publish. This will always be an object even if no latest version was found.

### Notes

This task internally uses [task-npm-registry](../autorelease-task-npm-registry) to get the registry url. That task requires that a registry url be listed in the `package.json` file. If there is no registry url, this task will throw an error.

When this task is called directly, it returns the lastest package object.
