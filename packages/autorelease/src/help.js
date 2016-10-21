import chalk from "chalk";

export default function({ cli }) {
  cli.reset(0);
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
  cli.print(`These are common tasks that are available.\nTo view a concrete list of all tasks as they have been configured, use ${chalk.blue("autorelease ls")}`);
	cli.newline();

  cli.printOptions({
    "help": `Show help message for autorelease or specific tasks. This will prevent the typical task run and instead pulls help on all the listed tasks.`,
    "version": "Prints the version of autorelease and configured plugins.",
    "ls": "Prints a tree of all configured tasks by name.",
    "setup": "Runs a fancy CLI tool that walks you through the process of setting up a project with autorelease."
  });
  cli.outdent();

  cli.newline();
}
