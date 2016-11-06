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
    let {plugins,tasks} = ctx.options;
    plugins = plugins != null ? [].concat(plugins) : [];

    // apply plugins first
    while (plugins.length) {
      await autorelease.use(plugins.shift(), ctx.basedir);
    }

    // then apply user tasks to override plugins
    await autorelease.applyTasks(tasks, ctx.basedir);
  }

  return autorelease;
}
