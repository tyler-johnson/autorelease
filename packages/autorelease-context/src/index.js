import {dirname,resolve} from "path";
import pkgUp from "pkg-up";
import findUp from "find-up";
import parser from "./parser";
import {readFile as _readFile} from "fs";
import {extend} from "plain-merge";
import {exec as _exec,spawn as _spawn} from "child_process";
import promisify from "es6-promisify";
import _debug from "debug";

const debugexec = _debug("autorelease-context:exec");
const readFile = promisify(_readFile);
const execAsync = promisify(_exec);

export default async function(opts={}) {
  let {basedir} = opts;
  const configfile = await findUp(".autoreleaserc", { cwd: basedir });
  const ctx = {};
  const conf = {};

  if (configfile) {
    if (!basedir) basedir = dirname(configfile);

    try {
      Object.assign(conf, parser(await readFile(configfile, "utf8")));
      ctx.configFile = configfile;
    } catch(e) {
      throw(`Could not parse config file '${configfile}'`);
    }
  }

  ctx.basedir = resolve(basedir || ".");
  ctx.options = extend(conf, opts);
  ctx.dryrun = ctx.options.dryrun || false;

  const pkgfile = ctx.packageFile = await pkgUp(basedir);
  ctx.package = pkgfile ? JSON.parse(await readFile(pkgfile, "utf-8")) : {};

  ctx.exec = exec;
  ctx.spawn = spawn;

  return ctx;
}

async function exec(cmd, opts) {
  debugexec(cmd);
  return await execAsync(cmd, {
    cwd: this.basedir,
    ...opts
  });
}

function spawn(cmd, args, opts) {
  if (typeof args === "object" && args != null && !Array.isArray(args)) {
    [opts,args] = [args,[]];
  }

  debugexec("%s %s", cmd, JSON.stringify(args));
  return _spawn(cmd, args, {
    cwd: this.basedir,
    ...opts
  });
}
