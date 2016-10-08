import chalk from "chalk";
import {cli} from "autorelease-utils";

export default function() {
  cli.reset(1);
  cli.newline();
  cli.print(`${chalk.bold.bgWhite.black("Autorelease")}`);

  cli.newline();
	cli.indent();
	cli.print(`Automated NPM publish.`);
	cli.outdent();

  cli.newline();
	cli.print(chalk.bold("Usage"));
	cli.newline();
	cli.indent();
	cli.print(chalk.dim("$ autorelease [OPTIONS] [TASKS...]"));

  cli.newline();
  cli.printOptions({
    "-h, --help": "Show help message for autorelease.",
    "-v, --version": "Print the version of autorelease and plugins."
  });
  cli.outdent();

  cli.newline();
	cli.print(chalk.bold("Tasks"));
	cli.newline();

  cli.indent();
  cli.print(`These are common tasks that are available. To view a concrete list of all tasks as they have been configured, use ${chalk.blue("autorelease ls")}`);
	cli.newline();

  cli.printOptions({
    "help": `Show help message for autorelease or specific tasks. This task is special because it prevents the typical task run and instead pulls help on all the listed tasks. For example, calling ${chalk.blue("autorelease help pre post")} is the equivalent of calling ${chalk.blue("autorelease help.pre help.post")}.`,
    "version": "Print the version of autorelease and plugins.",
    "ls": "A special task that prints a tree of all tasks by name.",
    "setup": "Runs a fancy CLI tool that walks you through the process of setting up a project with autorelease."
  });
  cli.outdent();

  cli.newline();
}
