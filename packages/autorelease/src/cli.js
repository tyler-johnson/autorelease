import minimist from "minimist";
import {difference,toPath} from "lodash";
import chalk from "chalk";
import {name,version} from "../package.json";
import help from "./help";
import ls from "autorelease-task-ls";
import autorelease from "./index";
import * as cli from "./cli-utils";

const argv = minimist(process.argv.slice(2), {
  boolean: [ "help", "version" ],
  alias: {
    h: "help", H: "help",
    v: "version", V: "version"
  }
});

if (argv.help) argv._ = ["help"];
else if (argv.version) argv._ = ["version"];

(async () => {
  const pipeline = await autorelease(argv);
  pipeline.context.cli = cli;

  pipeline.add("ls", ls);
  pipeline.add("help.autorelease", help);
  pipeline.pipeline("version").add(function() {
    console.log("%s %s", name, version);
  });

  let tasknames = commonPaths(argv._);
  tasknames = tasknames.map(t => t.trim()).filter(Boolean);

  if (tasknames.some(t => {
    return t.toLowerCase() === "help";
  })) {
    tasknames = tasknames
      .filter(t => t.toLowerCase() !== "help")
      .map(t => "help." + t);
  }

  if (!tasknames.length) {
    tasknames.push("help.autorelease");
  }

  const tasks = [];
  const missing = [];
  while (tasknames.length) {
    const n = tasknames.shift();
    const task = pipeline.get(n);
    if (!task) missing.push(n);
    else tasks.push(task);
  }

  if (missing.length) {
    throw(`Missing the following tasks:\n  ${missing.join("\n  ")}\n\nNeed help? Run ${chalk.blue("autorelease help")}`);
  }

  while (tasks.length) {
    await tasks.shift()(pipeline.context);
  }
})().catch(e => {
  console.error("");
  console.error(chalk.bgRed.white.bold("Aborted Release"));
  console.error(e.stack ? e.stack : e.toString ? e.toString() : e);
  console.error("");
  process.exit(1);
});

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
