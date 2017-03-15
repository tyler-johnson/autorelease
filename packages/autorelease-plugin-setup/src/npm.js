import getRegistry, {loadNpmConf} from "autorelease-task-npm-registry";
import chalk from "chalk";
import nerfDart from "nerf-dart";
import promisify from "es6-promisify";
import _getNpmToken from "get-npm-token";
import keytar from "keytar";

const getNpmToken = promisify(_getNpmToken);

// 3. configure project for NPM
export default async function(ctx) {
  ctx.cli.print(chalk.blue("Next, we'll configure secure NPM registry access."));

  //  3.1. check if user has existing token
  const {npmToken} = await ctx.prompt([{
    type: "confirm",
    name: "confirm",
    message: "Do you have an existing NPM token you want to use?",
    default: false
  }, {
    type: "input",
    name: "npmToken",
    message: "Enter the token:",
    when: ({confirm:c}) => c
  }]);

  if (npmToken) {
    ctx.npmToken = npmToken;
  } else {
    //  3.2. npm registry url
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

    //  3.3. obtain npm token
    const conf = await loadNpmConf({ prefix: ctx.basedir });
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
      type: "password",
      name: "password",
      message: "What is your NPM password?",
      when: ({confirm:c}) => !c
    }]);

    ctx.npmToken = await getNpmToken("https:" + registry, username, email, r.password || password);
    ctx.cli.print(`Thanks! Your NPM token is ${ctx.npmToken}`);

    // add password after we successfully get a token
    if (r.password) keytar.addPassword("npm:" + registry, username, r.password);
  }

  ctx.cli.print("Depending on your environment, you may need to manually set this to the NPM_TOKEN env var.");
  return true;
}
