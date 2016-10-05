import minimist from "minimist";
import {difference,toPath} from "lodash";

const autorelease = require("./");

export default async function(argv) {
  const args = minimist(argv._, {
    boolean: [ "all" ],
    alias: { a: "all" }
  });

  const pipeline = await autorelease(args);

  if (args.all) {
    await pipeline();
    return;
  }

  const pipes = commonPaths(args._);

  if (!pipes.length) {
    throw new Error("No pipeline specified to run.");
  }

  while (pipes.length) {
    await pipeline.pipeline(pipes.shift())(pipeline.context);
  }
}

function commonPaths(paths) {
  return paths.reduce((m, path) => {
    path = toPath(path);

    // check if a shorter variant already exists
    if (m.some(p => arrayStartsWith(path, p))) {
      return m;
    }

    // check if a longer variant already exists
    m.some((p,i) => {
      if (arrayStartsWith(p, path)) {
        m.splice(i, 1);
        return true;
      }
    });

    m.push(path);
    return m;
  }, []).map(path => path.join("."));
}

function arrayStartsWith(arr, test) {
  return test.length > arr.length ? false :
    !difference(arr.slice(0, test.length), test).length;
}
