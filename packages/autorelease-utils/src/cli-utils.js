import {forEach,repeat} from "lodash";
import {format} from "util";
import chalk from "chalk";
import cliformat from "cli-format";

let dashi = cliformat.defaults.breaks.indexOf("-");
cliformat.defaults.breaks.splice(dashi, 1);
let tablen = 0;

export const reset = (i=0) => tablen = i;

export const newline = (r=1) => console.log(repeat("\n", r - 1));
export const indent = () => tablen++;
export const outdent = () => tablen = Math.max(0, tablen - 1);
export const print = function() {
  console.log(cliformat.wrap(format.apply(null, arguments), {
    paddingLeft: repeat("  ", tablen),
    paddingRight: " ",
    justify: true
  }));
};

export const printOption = (msg, opt) => {
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

export const printOptions = (opts) => {
  forEach(opts, printOption);
};
