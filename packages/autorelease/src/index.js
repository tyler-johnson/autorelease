import pipeline from "autorelease-pipeline";
import createContext from "autorelease-context";
import plugins from "./plugins";
import tasks from "./tasks";

export default async function(opts={}) {
  const ctx = await createContext(opts);
  const autorelease = await createPipeline(ctx);
  autorelease.context = ctx;
  return autorelease;
}

export async function createPipeline(ctx={}) {
  const autorelease = pipeline((o, next) => next(ctx));

  if (ctx.options) {
    await plugins(autorelease, ctx.options.plugins, ctx.basedir);
    await tasks(autorelease, ctx.options.tasks, ctx.basedir);
  }

  return autorelease;
}
