# Autorelease Task: Resolve Version

An Autorelease task that resolves the version number using commit message types and the semver standard.

This task is a part of [plugin-pre](../autorelease-plugin-pre) and [plugin-core](../autorelease-plugin-core).

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-task-resolve-version -D
```

Add the tasks to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "pre": ["resolve-version"]
  }
}
```

### Config

This task adds the following configuration to the `.autoreleaserc`.

- `version` - This is the NPM package version to use as the "base". This version is bumped according to rules. Defaults to "latest" which is resolved against the registry.`
- `prerelease` - When set, the version bump will be a prerelease instead of a normal release. Set this to a the string to use for the prerelease. For example, if this is set to `alpha`, the next version would be something like `1.0.0-alpha.0`.

### Context

This task modifies context for future tasks by adding the following key:

- `version` - An object representing the next version.
  - `version.next` - The next semver version.
  - `version.previous` - The previous semver version.
  - `version.type` - The semver bump type, usually `major`, `minor` or `patch`.
  - `version.pre` - The prelease version type. `undefined` when not a prerelease.

### Notes

This tasks relies on the context having `latest` and `commits` fields. These are generally set by tasks like [task-fetch-latest](../autorelease-task-fetch-latest) and [task-fetch-commits](../autorelease-task-fetch-commits).

This task expects commits in the following format, according to [task-fetch-commits](../autorelease-task-fetch-commits):

```
<type>(<scope>): <subject>
<body>
<footer>
```

This task will bump the version according to the following rules:

1. If `BREAKING CHANGE` is found in any commit `<body>`, the next version is a major version bump.
2. Otherwise if any commit has a commit `<type>` of `feat`, the next version is a minor version bump.
3. Otherwise if any commit has a commit `<type>` of `fix`, the next version is a patch version bump.
4. If the `prerelease` config is set, the next version bump is a prerelease in addition to major/minor/patch. The prerelease string is used for the prerelease type. If the lastest version was also a prerelase, this will bump the prerelease version.
5. If no fix, feature or breaking change was detected, the version is not bumped and an error is thrown.

When this task is called directly, it returns the object representing the new version.
