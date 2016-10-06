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

  const pipeline = createPipeline((o, next) => next(ctx));
  pipeline.context = ctx;
  await plugins(ctx.options.plugins, basedir, pipeline);
  await tasks(ctx.options.tasks, basedir, pipeline);
  return pipeline;
}
