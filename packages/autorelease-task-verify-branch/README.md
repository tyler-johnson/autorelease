# Autorelease Task: Verify Branch

An Autorelease task that verifies the current git branch is allowed to be publish.

This task is a part of [plugin-core](../autorelease-plugin-core).

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-task-verify-branch -D
```

Add the tasks to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "verify": ["verify-branch"]
  }
}
```

### Config

This task adds the following configuration to the `.autoreleaserc`.

- `branch` - A git branch name or array of branch names. This task will ensure the current git branch is among those listed.

### Context

This task does not modify contenxt.

### Notes

This task is quite basic and will compare branch names literally, no wildcard or regexp based matching.

This task will throw an error if the branch name doesn't match.
