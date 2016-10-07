import createPipeline from "autorelease-pipeline";
import plugins from "./plugins";
import tasks from "./tasks";
import rc from "autorelease-rc";

export default async function(opts={}) {
  const ctx = await rc(opts);
  const autorelease = createPipeline((o, next) => next(ctx));

  // cyclical links so everythink can talk
  autorelease.context = ctx;
  ctx.root = autorelease;

  // add plugins and tasks
  await plugins(autorelease, ctx.options.plugins, ctx.basedir);
  await tasks(autorelease, ctx.options.tasks, ctx.basedir);

  return autorelease;
}
