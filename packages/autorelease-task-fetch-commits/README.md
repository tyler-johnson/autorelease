# Autorelease Task: Fetch Commits

An Autorelease task that fetches all the git commits since the last release and parses them useable format.

This task is a part of [plugin-pre](../autorelease-plugin-pre) and [plugin-core](../autorelease-plugin-core).

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-task-fetch-commits -D
```

Add the tasks to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "pre": ["fetch-commits"]
  }
}
```

### Config

This task adds the following configuration to the `.autoreleaserc`.

- `version` - This is the NPM package version to begin fetching commits at. Defaults to `"latest"`
- `gitRef` - When the package has no previous version, this git commit reference is used as the base.

### Context

This task modifies context for future tasks by adding the following key. [task-fetch-latest](../autorelease-task-fetch-latest) also adds keys to the configuration.

- `commits` - Array of parsed commits since the last release.

### Notes

This tasks relies on the latest `package.json` from the NPM registry. Use a task like [task-fetch-latest](../autorelease-task-fetch-commits) prior to this one.

This task parses commits in the following format. You can view more info on the parser [in the conventional-commits-parser docs](https://github.com/conventional-changelog/conventional-commits-parser).

```
<type>(<scope>): <subject>
<body>
<footer>
```

When this task is called directly, it returns an array of commits.
