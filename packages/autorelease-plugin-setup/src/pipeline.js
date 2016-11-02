import createPipeline from "autorelease-pipeline";
import {createPromptModule} from "inquirer";
import chalk from "chalk";
import {Repository} from "autorelease-test-utils";
import step2 from "./autorelease";
import step3 from "./npm";
import {relative} from "path";

// 1. welcome
async function welcome(ctx) {
  ctx.cli.reset();
  ctx.cli.print(chalk.bold("Welcome to the Autorelease Setup Utility ⚗"));
  ctx.cli.print("This tool will guide you through the process of setting up your project for automatic NPM publish.");

  // 1.1. verify that a package.json exists
  if (!ctx.packageFile) {
    throw "This project is missing a package.json file. Please add it before running Autorelease setup.";
  }

  ctx.howTo = `To start releasing immediately, commit these changes and run ${chalk.blue("npm run autorelease")} 📦`;
}

// 5. finish and clean
async function finish(ctx) {
  ctx.cli.print(chalk.blue("And we're finished! Doing a bit of clean up."));

  //  5.1. write .autoreleaserc
  await ctx.repo.rc(ctx.config).flush();

  //  5.2. add autorelease script to package.json
  const relpkg = relative(ctx.basedir, ctx.packageFile);
  ctx.package = JSON.parse(await ctx.repo.readFile(relpkg));
  if (ctx.package.scripts == null) ctx.package.scripts = {};
  ctx.package.scripts.autorelease = "autorelease verify pre && npm publish && autorelease post";
  await ctx.repo.package(ctx.package).flush();

  ctx.cli.print("I've updated the .autoreleaserc and package.json files with the newest info.");

  ctx.cli.newline();
  ctx.cli.print(chalk.green.bold("Your project has been setup with Autorelease 🎉"));
  if (ctx.howTo) ctx.cli.print(ctx.howTo);
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
    await step3(ctx);
    ctx.cli.newline();

    // 4. plugin setup

    // 5. finish and clean
    await finish(ctx);
  });

  return pipeline;
}
