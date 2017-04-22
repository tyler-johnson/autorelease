# autorelease-context

[![npm](https://img.shields.io/npm/v/autorelease-context.svg)](https://www.npmjs.com/package/autorelease-context)

Generates the context object for an Autorelease task.

```bash
npm i autorelease-context -S
```

### Usage

```js
import createContext from "autorelease-context";
```

#### createContext()

```
createContext([ options ]) → Promise<Context>
```

Creates a context object used by Autorelease tasks.

- `options` (Object) - Optional options to configure the context with.
  - `options.basedir` (String) - The working directory to release out of.

This method is asynchronous since it searches the filesystem for two files: `.autoreleaserc` and `package.json`. The `.autoreleaserc` file is used as configuration and is merged with `options`. The resulting context object with have the following properties:

- `basedir` - The current working directory. This is generally the same directory the `.autoreleaserc` was found in.
- `options` - The options that were passed in, merged with the `.autoreleaserc` file.
- `package` - The parsed `package.json` contents. This will always be an object, even if no `package.json` was found.
- `packageFile` - The full path to the `package.json`.
- `configFile` - The full path to the `.autoreleaserc`.
- `exec()` / `spawn()` - Functions to execute shell commands. Indentical to `child_process`, except `exec()` returns a promise and `cwd` defaults to `basedir`
