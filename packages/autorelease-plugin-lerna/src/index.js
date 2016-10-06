import verify from "autorelease-task-verify";
import fetchLatest from "autorelease-task-fetch-latest";
import fetchCommits from "autorelease-task-fetch-commits";
import resolveVersion from "autorelease-task-resolve-version";
import configureNpm from "autorelease-task-configure-npm";
// import prepPublish from "autorelease-task-prep-publish";
import createPipeline from "./pipeline";

export default function(autorelease) {
  const pipeline = createPipeline();
  autorelease.add("pre", pipeline);

  // push verify to end of pipeline (no-conflict mode)
  pipeline.pipeline("verify").add(verify);

  // set the remaining tasks by name (overwrite mode)
  pipeline.add("configureNpm", configureNpm)
    .addLernaTask("fetchLatest", fetchLatest)
    .addLernaTask("fetchCommits", fetchCommits)
    .addLernaTask("resolveVersion", resolveVersion)
    .addLernaTask("prepPublish", (ctx) => {
      console.log(ctx.package.name, ctx.package.version, ctx.version.next);
    });
}
