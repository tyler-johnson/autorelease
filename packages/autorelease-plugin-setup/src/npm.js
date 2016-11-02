import getRegistry from "autorelease-task-npm-registry";
import chalk from "chalk";
import npmconf from "autorelease-task-npm-registry/lib/npmconf";
import nerfDart from "nerf-dart";
import promisify from "es6-promisify";
import _getNpmToken from "get-npm-token";
import keytar from "keytar";

const getNpmToken = promisify(_getNpmToken);

// 3. configure project for NPM
export default async function(ctx) {
  ctx.cli.print(chalk.blue("Next, we'll configure NPM registry access."));

  //  3.1. npm registry url
  let defReg = await getRegistry(ctx);
  let {registry} = await ctx.prompt([{
    type: "input",
    name: "registry",
    message: "What is the NPM registry URL to use for publishing?",
    default: defReg,
    filter: nerfDart
  }]);

  if (registry !== defReg) {
    if (ctx.package.publishConfig == null) {
      ctx.package.publishConfig = {};
    }

    ctx.package.publishConfig.registry = registry;
  }

  //  3.2. obtain npm token
  const conf = await npmconf({ prefix: ctx.basedir });
  let {username,email} = await ctx.prompt([{
    type: "input",
    name: "username",
    message: "What is your NPM username?",
    default: conf.get("username"),
    validate: (s) => Boolean(s)
  },{
    type: "input",
    name: "email",
    message: "What is your NPM email?",
    default: conf.get("email"),
    validate: (s) => Boolean(s)
  }]);

  let password = keytar.getPassword("npm:" + registry, username);

  const r = await ctx.prompt([{
    type: "confirm",
    name: "confirm",
    message: "I found a password in your keyring for this NPM registry and user. Can I use it?",
    default: true,
    when: () => Boolean(password)
  },{
    type: "input",
    name: "password",
    message: "What is your NPM password?",
    when: ({confirm:c}) => !c
  }]);

  if (r.password) {
    password = r.password;
    keytar.addPassword("npm:" + registry, username, password);
  }

  ctx.cli.print("Thanks! I'm retrieving an NPM Token for you using those credentials...");
  ctx.npmToken = await getNpmToken("https:" + registry, username, email, password);
  ctx.cli.print(`Done. In case it gets lost later, your NPM token is ${ctx.npmToken}`);
}
