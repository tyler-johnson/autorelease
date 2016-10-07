import {forEach,repeat} from "lodash";
import {format} from "util";
import chalk from "chalk";
import cliformat from "cli-format";

let dashi = cliformat.defaults.breaks.indexOf("-");
cliformat.defaults.breaks.splice(dashi, 1);
let tablen = 1;

const newline = (r=1) => console.log(repeat("\n", r - 1));
const indent = () => tablen++;
const outdent = () => tablen = Math.max(1, tablen - 1);
const print = function() {
  console.log(cliformat.wrap(format.apply(null, arguments), {
    paddingLeft: repeat("  ", tablen),
    paddingRight: " ",
    justify: true
  }));
};
const printOption = (msg, opt) => {
  console.log(cliformat.columns.wrap([{
    content: chalk.green(opt),
    width: 28,
    paddingLeft: repeat("  ", tablen)
  }, {
    content: msg,
    justify: true,
    paddingRight: " "
  }]));
};

export default function() {
  tablen = 1;
  newline();
  print(`${chalk.bold.bgWhite.black("Autorelease")}`);

  // newline();
	// indent();
	// print(`Automated NPM publish.`);
	// outdent();

  newline();
	print(chalk.bold("Usage"));
	newline();
	indent();
	print(chalk.dim("$ autorelease [OPTIONS] [TASKS...]"));

  newline();
  forEach({
    "-h, --help": "Show help message for autorelease.",
    "-v, --version": "Print the version of autorelease and plugins."
  }, printOption);
  outdent();

  newline();
	print(chalk.bold("Tasks"));
	newline();

  indent();
  print(`These are common tasks that are available. To view a concrete list of all tasks as they have been configured, use ${chalk.blue("autorelease ls")}`);
	newline();

  forEach({
    "help": `Show help message for autorelease or specific tasks. This task is special because it prevents the typical task run and instead pulls help on all the listed tasks. For example, calling ${chalk.blue("autorelease help pre post")} is the equivalent of calling ${chalk.blue("autorelease help.pre help.post")}.`,
    "version": "Print the version of autorelease and plugins.",
    "ls": "A special task that prints a tree of all tasks by name.",
    "setup": "Runs a fancy CLI tool that walks you through the process of setting up a project with autorelease."
  }, printOption);
  outdent();

  newline();
}
