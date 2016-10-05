import minimist from "minimist";
import * as commands from "./cmds/index";

const argv = minimist(process.argv.slice(2), {
  boolean: [ "help", "version" ],
  alias: {
    h: "help", H: "help",
    v: "version", V: "version"
  },
  stopEarly: true
});

let cmd;
if (argv.help) cmd = "help";
else if (argv.version) cmd = "version";
else if (argv._.length) cmd = argv._.shift();
if (!cmd || !commands[cmd]) cmd = "help";

Promise.resolve(commands[cmd](argv)).catch(e => {
  console.error(e);
  process.exit(1);
});
