import createPipeline from "autorelease-pipeline";
import plugins from "./plugins";
import tasks from "./tasks";
import rc from "rc";
import {resolve} from "path";

export default async function(opts={}) {
  const {basedir=process.cwd()} = opts;
	const pkgfile = resolve(basedir, "package.json");
	const pkg = require(pkgfile);
  const ctx = { package: pkg, packageFile: pkgfile, basedir };

  ctx.options = rc("autorelease", {
    ...pkg.autorelease,
		...opts
  });

  const autorelease = createPipeline((o, next) => next(ctx));

  // cyclical links so everythink can talk
  autorelease.context = ctx;
  ctx.root = autorelease;

  // add plugins and tasks
  await plugins(ctx.options.plugins, basedir, autorelease);
  await tasks(ctx.options.tasks, basedir, autorelease);

  return autorelease;
}
