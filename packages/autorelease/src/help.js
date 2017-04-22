import chalk from "chalk";

export default function({ cli }) {
  cli.reset(0);
  cli.newline();
	cli.indent();
  cli.print(`${chalk.bold.bgWhite.black("Autorelease")}`);

  cli.newline();
	cli.print(`Automated NPM publish.`);

  cli.newline();
	cli.print(chalk.bold("Usage"));
	cli.newline();
	cli.print(chalk.gray("$ autorelease [OPTIONS] [TASKS...]"));

  cli.newline();
  cli.printOptions({
    "-h, --help": "Show help message for autorelease.",
    "-v, --version": "Print the version of autorelease and plugins.",
    "-n, --dryrun": "Safely run the tasks to see what they do without releasing.",
    "-p, --plugin": "Override configured plugins. Specify more than once for multiple plugins."
  }, {
    optionColor: "gray",
    width: 20
  });
	cli.newline();
  cli.print(`CLI options are merged with .autoreleaserc config, allowing project level configuration to be overridden.`);

  cli.newline();
	cli.print(chalk.bold("Tasks"));
	cli.newline();

  cli.print(`These are common tasks that are available.\nTo view the list of all tasks as configured, use ${chalk.blue("autorelease ls")}`);
	cli.newline();

  cli.printOptions({
    "help": `Show help message for autorelease or specific tasks. When other tasks are specified, this will prevent the typical task run and instead shows help on the listed tasks.`,
    "version": "Prints the version of autorelease and configured plugins.",
    "ls": "Prints a tree of all configured tasks by name.",
    "setup": "Runs a fancy CLI tool that walks you through the process of setting up a project with autorelease."
  }, {
    optionColor: "blue",
    width: 10
  });

  cli.outdent();
  cli.newline();
}
