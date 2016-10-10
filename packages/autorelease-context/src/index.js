import {dirname} from "path";
import pkgUp from "pkg-up";
import findUp from "find-up";
import parser from "./parser";
import {readFile as _readFile} from "fs";
import {promisify} from "autorelease-utils";
import {merge} from "lodash";

const readFile = promisify(_readFile);

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

  ctx.basedir = basedir;
  const pkgfile = ctx.packageFile = await pkgUp(basedir);
  ctx.package = pkgfile ? JSON.parse(await readFile(pkgfile, "utf-8")) : {};
  ctx.options = merge(conf, opts);
  return ctx;
}
