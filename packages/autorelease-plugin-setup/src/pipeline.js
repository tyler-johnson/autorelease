import createPipeline from "autorelease-pipeline";
import {createPromptModule} from "inquirer";
import chalk from "chalk";
import {Repository} from "autorelease-test-utils";
import step2 from "./autorelease";
import step3 from "./npm";
import {relative} from "path";

function toScript(tasks) {
  return "autorelease " + tasks.join(" ");
}

// 1. welcome
async function welcome(ctx) {
  ctx.cli.reset();
  ctx.cli.print(chalk.bold("Welcome to the Autorelease Setup Utility 🌴"));
  ctx.cli.print("This tool will guide you through the process of setting up your project for automatic NPM publish.");

  // 1.1. verify that a package.json exists
  if (!ctx.packageFile) {
    throw "This project is missing a package.json file. Please add it before running Autorelease setup.";
  }

  // 1.2. make sure the user is ready to proceed
  const {confirm} = await ctx.prompt([{
    type: "confirm",
    name: "confirm",
    message: "Are you ready to begin?"
  }]);

  if (!confirm) {
    throw "Take your time. I'm ready when you are! 👌";
  }

  // 1.3. prepare autorelease script handling for plugins
  const tasks = {};
  ctx.script = {};
  ["before","publish","after"].forEach(type => {
    const T = tasks[type] = [];
    ctx.script[type] = function(task) {
      if (typeof task !== "string") {
        throw new Error("Expecting string for task.");
      }
      
      if (T.indexOf(task) < 0) T.push(task);
    };
  });

  ctx.getScript = function() {
    const {before,publish,after} = tasks;
    if (publish.length) {
      return toScript([].concat(before,publish,after));
    }

    let scripts = [];
    if (before.length) scripts.push(toScript(before));
    scripts.push("npm publish");
    if (after.length) scripts.push(toScript(after));
    return scripts.join(" && ");
  };
}

// 4. plugin setup
async function plugins(ctx) {
  const pipe = ctx.plugins.pipeline("setup");

  ctx.cli.print(chalk.blue(pipe.size() ?
    "Now I'll run setup for each of your plugins." :
    "None of your plugins have setup, so I'm skipping them."));

  if (pipe.size()) await pipe(ctx);
}

// 5. finish and clean
async function finish(ctx) {
  ctx.cli.print(chalk.blue("Let's wrap this up."));

  //  5.1. write .autoreleaserc
  await ctx.repo.rc(ctx.config).flush();
  ctx.cli.print("I've updated the .autoreleaserc file with the newest configuration.");

  //  5.2. add autorelease script to package.json
  const relpkg = relative(ctx.basedir, ctx.packageFile);
  ctx.package = JSON.parse(await ctx.repo.readFile(relpkg));
  if (ctx.package.scripts == null) ctx.package.scripts = {};
  ctx.package.scripts.autorelease = ctx.getScript();
  await ctx.repo.package(ctx.package).flush();
  ctx.cli.print("I also added an autorelease script to your package.json. Please verify it before using.");

  ctx.cli.newline();
  ctx.cli.print(chalk.green.bold("Your project has been setup with Autorelease. Happy releasing! 🎉"));
}

export default function() {
  const pipeline = createPipeline(async function(ctx) {
    ctx.prompt = createPromptModule();
    ctx.repo = new Repository(ctx.basedir);

    // 1. welcome
    await welcome(ctx);
    ctx.cli.newline();

    // 2. configure project for autorelease
    await step2(ctx);
    ctx.cli.newline();

    // 3. configure project for NPM
    if (await step3(ctx)) ctx.cli.newline();

    // 4. plugin setup
    await plugins(ctx);
    ctx.cli.newline();

    // 5. finish and clean
    await finish(ctx);
  });

  return pipeline;
}
