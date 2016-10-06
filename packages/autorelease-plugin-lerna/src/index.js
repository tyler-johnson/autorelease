import verify from "autorelease-task-verify";
import fetchLatest from "autorelease-task-fetch-latest";
// import resolveVersion from "autorelease-task-resolve-version";
import configureNpm from "autorelease-task-configure-npm";
// import prepPublish from "autorelease-task-prep-publish";
import createPipeline from "./pipeline";
import fetchCommits from "./commits";

export default function(autorelease) {
  const pipeline = createPipeline();
  autorelease.add("pre", pipeline);

  // push verify to end of pipeline (no-conflict mode)
  pipeline.pipeline("verify").add(verify);

  // set the remaining tasks by name (overwrite mode)
  pipeline.add("configureNpm", configureNpm)
    .addLernaTask("fetchLatest", fetchLatest, [ "latest" ])
    .add("fetchCommits", fetchCommits());
    // .addLernaTask("fetchCommits", async (ctx) => {
    //
    //
    //   // ct
    //   // console.log(ctx.package.name, ctx.package.version, ctx.latest && ctx.latest.version, ctx.parentContext.latest && ctx.parentContext.latest.version);
    // }, [ "commits" ]);
    // .addLernaTask("resolveVersion", resolveVersion, [ "version" ])
    // .addLernaTask("prepPublish", (ctx) => {
    //   console.log(ctx.package.name, ctx.package.version, ctx.version.next);
    // });
}
