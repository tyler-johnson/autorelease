import * as methods from "./pipeline";
import run from "./run";

export function createPipeline(fn) {
  function pipeline(ctx) {
    return fn ? fn.call(pipeline, ctx, next) : next(ctx);
  }

  const next = run.bind(pipeline);
  Object.assign(pipeline, methods);
  pipeline.init();

  return pipeline;
}

export default createPipeline;
export {methods,run};
