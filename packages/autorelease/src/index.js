import pipeline from "autorelease-pipeline";
import createContext from "autorelease-context";

export default async function(opts={}) {
  const ctx = await createContext(opts);
  const autorelease = await createPipeline(ctx);
  autorelease.context = ctx;
  return autorelease;
}

export async function createPipeline(ctx={}) {
  const autorelease = pipeline((o, next) => next(ctx));

  if (ctx.options) {
    // apply plugins first
    const plugins = [].concat(ctx.options.plugins);
    while (plugins.length) {
      await autorelease.use(plugins.shift(), ctx.basedir);
    }

    // then apply user tasks to override plugins
    await autorelease.applyTasks(ctx.options.tasks, ctx.basedir);
  }

  return autorelease;
}
