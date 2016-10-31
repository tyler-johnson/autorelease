# Autorelease Task: NPM Registry

An Autorelease task that fetches the published NPM registry url. This task is a helper task that is used directly by other Autorelease tasks.

### Usage

Install as a dev dependency in your project.

```bash
npm i autorelease-task-npm-registry -D
```

Add the task to your `.autoreleaserc` config.

```json
{
  "tasks": {
    "pre": ["npm-registry"]
  }
}
```

### Config

This task does not add any configuration to the `.autoreleaserc`.

### Context

This task modifies context for future tasks by adding the following key:

- `registry` - The NPM registry url to be published to.

### Notes

This task will look for a registry url under the `packageConfig` setting in the `package.json`. Otherwise, it look for the url in your `.npmrc` config. As a last resort, it will use the default NPM registry url: `https://registry.npmjs.org`.

When this task is called directly, it returns the NPM registry url.
