import * as methods from "./methods";
import applyTasks from "./apply-tasks";
import plugins from "./plugins";

export function createPipeline(fn) {
  function pipeline(ctx) {
    return fn ? fn.call(pipeline, ctx, next) : next(ctx);
  }

  const next = methods.run.bind(pipeline);
  Object.assign(pipeline, methods);
  pipeline.applyTasks = applyTasks;
  pipeline.use = plugins;
  pipeline.init();

  return pipeline;
}

export default createPipeline;
export {methods,applyTasks,plugins};
