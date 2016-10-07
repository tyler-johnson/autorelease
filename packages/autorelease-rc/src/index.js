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
  const conf = {};

  if (configfile) {
    if (!basedir) basedir = dirname(configfile);

    try {
      Object.assign(conf, parser(await readFile(configfile, "utf8")));
    } catch(e) {
      throw(`Could not parse config file '${configfile}'`);
    }
  }

  const pkgfile = await pkgUp(basedir);
  if (pkgfile == null) {
    throw "Could not locate a package.json";
  }

  const ctx = { basedir };
  ctx.packageFile = pkgfile;
  ctx.package = JSON.parse(await readFile(pkgfile, "utf-8"));
  ctx.options = merge(conf, opts);
  return ctx;
}
