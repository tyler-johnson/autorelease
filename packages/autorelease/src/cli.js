import minimist from "minimist";
import {difference,toPath} from "lodash";
import chalk from "chalk";
import {name,version} from "../package.json";
import help from "./help";
import ls from "autorelease-task-ls";
import {createPipeline} from "./index";
import createContext from "autorelease-context";
import * as cli from "./cli-utils";

const argv = minimist(process.argv.slice(2), {
  boolean: [ "help", "version", "dryrun" ],
  alias: {
    h: "help", H: "help",
    v: "version", V: "version",
    n: "dryrun",
    p: "plugin"
  }
});

if (argv.help) argv._ = ["help"];
else if (argv.version) argv._ = ["version"];

function isRealTask(n) {
  return n !== "ls" && n !== "version" && n.substr(0, 5) !== "help.";
}

(async () => {
  argv.plugins = argv.plugins === false ? [] :
    [].concat(argv.plugins, argv.plugin).filter(Boolean);
  if (!argv.plugins.length) delete argv.plugins;

  const ctx = await createContext(argv);
  const autorelease = await createPipeline(ctx);
  ctx.cli = cli;
  ctx.root = autorelease;

  autorelease.add("ls", ls);
  autorelease.add("help.autorelease", help);
  autorelease.pipeline("version").add(function() {
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
  let hasReal = false;
  while (tasknames.length) {
    const n = tasknames.shift();
    const task = autorelease.get(n);
    if (!task) {
      missing.push(n);
      continue;
    }

    tasks.push([n, task]);
  }

  if (missing.length) {
    throw(`Missing the following tasks:\n  ${missing.join("\n  ")}\n\nNeed help? Run ${chalk.blue("autorelease help")} 💁`);
  }

  if (ctx.dryrun) {
    console.log(chalk.yellow("This is a dryrun 👻"));
  }

  while (tasks.length) {
    const [n,task] = tasks.shift();

    if (isRealTask(n)) {
      hasReal = true;
      console.log(chalk.blue(`Running ${chalk.bold(n)} task 👷`));
    }

    await task(ctx);
  }

  if (hasReal) {
    console.log(chalk.green.bold("Autorelease completed successfully 🎉"));
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
