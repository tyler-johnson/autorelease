# Autorelease Task: Git Remote

An Autorelease task that determines the best git remote URL by looking at the `package.json` and `git remote`. This task is a helper task that is used directly by other Autorelease tasks.

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-task-git-remote -D
```

Add the task to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "verify": ["git-remote"]
  }
}
```

### Config

This task does not add any configuration to the `.autoreleaserc`.

### Context

This task modifies context for future tasks by adding the following key:

- `gitUrl` - An object of the parsed git url that was found. The parsing is handled by [git-url-parse](http://ghub.io/git-url-parse).

### Notes

This task first looks for a git url in the `package.json` under the `repository` field. All Autorelease tutorials will recommend that this is set as a result. If a git url is not found there, then the `origin` remote is used from the git repository.

This task will not throw an error if a git url is not found. Instead, the `ctx.gitUrl` value will not be set and the task will return `undefined`.

When this task is called directly, it returns the parsed git url object or `undefined` when not found.
