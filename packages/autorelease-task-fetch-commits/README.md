# Autorelease Task: Fetch Commits

An Autorelease task that fetches all the git commits since the last release and parses them useable format.

This task is a part of [plugin-pre](../autorelease-plugin-pre) and [plugin-core](../autorelease-plugin-core).

### Usage

Install as a dev dependency in your project. This task relies on [task-fetch-latest](../autorelease-task-fetch-latest) so install that one too.

```bash
npm i autorelease-task-fetch-commits autorelease-task-fetch-latest -D
```

Add the tasks to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "pre": ["fetch-latest", "fetch-commits"]
  }
}
```

### Config

This task adds the following configuration to the `.autoreleaserc`. [task-fetch-latest](../autorelease-task-fetch-latest) also has its own set of configuration.

- `version` - This is the NPM package version to begin fetching commits at. Defaults to `"latest"`
- `gitRef` - When the package has no previous version, this git commit reference is used as the base.

### Context

This task modifies context for future tasks by adding the following key. [task-fetch-latest](../autorelease-task-fetch-latest) also adds keys to the configuration.

- `commits` - Array of parsed commits since the last release.

### Notes

When this task is called directly, it returns an array of commits.
