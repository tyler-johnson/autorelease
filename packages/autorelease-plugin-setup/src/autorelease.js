import {join,relative} from "path";
import {union,padEnd} from "lodash";
import shellEscape from "shell-escape";
import ProgressBar from "progress";
import chalk from "chalk";
import createPipeline from "autorelease-pipeline";

function andify(list) {
  const len = list.length;
  return list.reduce((s, n, i) => {
    if (i) {
      if (len > 2) s += ",";
      s += i+1 === len ? " and " : " ";
    }
    return s + n;
  }, "");
}

function parsePlugins(plugins) {
  if (typeof plugins !== "string") return [];

  return plugins.split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

function truncate(str, n) {
  if (typeof str !== "string") str = "";
  str = str.substr(0, n);
  return padEnd(str, n, " ");
}

async function getPlugins(ctx, install) {
  let installmsg;

  if (install.length) {
    ctx.cli.print(`I'm planning to install ${install.length > 1 ? "plugins" : "the plugin"} ${andify(install)}.`);
    installmsg = "Are there more plugins you want me to install?";
  } else {
    ctx.cli.print("I'm not planning on installing any Autorelease plugins.");
    installmsg = "Are there plugins you want me to install?";
  }

  const {confirm,extra} = await ctx.prompt([{
    type: "confirm",
    name: "confirm",
    message: installmsg,
    default: false
  },{
    type: "input",
    name: "extra",
    message: "Enter comma separated plugin names.",
    when: ({confirm:c}) => c
  }]);

  if (!confirm) {
    return install;
  }

  install = union(install, parsePlugins(extra));
  return await getPlugins(ctx, install);
}

// 2. configure project for autorelease
export default async function(ctx) {
  ctx.cli.print(chalk.blue("Alright, let's start by adding base configuration for Autorelease."));

  // 2.1. install autorelease as dev dep
  if (!ctx.package.devDependencies || !ctx.package.devDependencies.autorelease) {
    ctx.cli.print("Autorelease is not a devDependency of this project. I'm installing it now.");
    await ctx.repo.exec("npm install -D autorelease");
  }

  // 2.2. check for existing .autoreleaserc
  if (ctx.configFile) {
    const {keep} = await ctx.prompt([{
      type: "confirm",
      name: "keep",
      message: "It looks like this project has an existing Autorelease configuration. Would you like to keep it?",
      default: true
    }]);

    if (!keep) {
      ctx.config = {};
    } else {
      const relconf = relative(ctx.basedir, ctx.configFile);
      ctx.config = JSON.parse(await ctx.repo.readFile(relconf));
    }
  } else {
    ctx.configFile = join(ctx.basedir, ".autoreleaserc");
    ctx.config = {};
  }

  // 2.3. install plugins and dependencies
  let install = [].concat(ctx.options.install, ctx.options.i)
    .filter(s => typeof s === "string")
    .reduce((m, s) => m.concat(parsePlugins(s)), []);

  install = await getPlugins(ctx, install);

  if (!install.length && (!ctx.config.plugins || !ctx.config.plugins.length)) {
    ctx.cli.print("No plugins provided so I'm going to setup for the local command line.");
    // install = ["core"]; // TODO
  }

  if (install.length) {
    if (ctx.config.plugins == null) ctx.config.plugins = [];

    let pb;
    if (process.stdout.isTTY && process.stdout.clearLine) {
      pb = new ProgressBar(`Installing :name ╢:bar╟ `, {
        total: install.length,
        complete: "█",
        incomplete: "░",
        clear: true,
        stream: process.stdout,
        width: (process.stdout.columns || 100) - (12 + 3 + 30)
      });
    }

    pb.render({ name: truncate(install[0], 30) });

    while (install.length) {
      let name = install.shift();

      if (ctx.config.plugins.indexOf(name) < 0) {
        ctx.config.plugins.push(name);
      }

      // TODO
      // if (!startsWith(name, "autorelease-plugin-")) {
      //   name = "autorelease-plugin-" + name;
      // }

      await ctx.repo.exec("npm install -D " + shellEscape([name]));
      pb.tick({ name: truncate(install[0], 30) });
    }
  }

  // 2.4. Load plugins for this setup
  if (!Array.isArray(ctx.config.plugins) || !ctx.config.plugins.length) {
    throw "No plugins are configured so there isn't much for me to do. 🤔";
  }

  ctx.cli.print("Loading plugins to see if they need setup.");
  const pipeline = ctx.plugins = createPipeline();
  pipeline.context = ctx;

  const plugins = [].concat(ctx.config.plugins);
  while (plugins.length) {
    await pipeline.use(plugins.shift(), ctx.basedir);
  }

  // 2.5. Ask about git branches
  let {branches} = await ctx.prompt([{
    type: "input",
    name: "branches",
    message: "Which git branch that should I allow releasing from? Leave empty for any.",
    default: ctx.config.branch ? [].concat(ctx.config.branch).filter(Boolean).join(",") : null
  }]);

  branches = parsePlugins(branches);
  if (branches.length) ctx.config.branch = branches;
}
