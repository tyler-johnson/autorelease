import createPipeline from "./pipeline";
import prepPublish from "autorelease-task-prep-publish";

const pipeline = createPipeline();
export default pipeline;

// write version to outer package.json for post step
pipeline.add(async (ctx) => {
  // non-independent mode, bump outer version normally
  if (!ctx.independent) {
    await prepPublish(ctx);
    return;
  }

  // find version for "main" package
  let version;
  ctx.updated.some(pkg => {
    if (pkg.name === ctx.package.name) {
      if (pkg.autorelease_ctx) version = pkg.autorelease_ctx.version;
      return true;
    }
  });

  // write new version to outer package.json
  await prepPublish({ ...ctx, version });
});

// write new versions to all updated packages
pipeline.addLernaTask(prepPublish, {
  updatedOnly: true,
  forceLoop: true
});
