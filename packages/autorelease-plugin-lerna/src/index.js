import verify from "autorelease-task-verify";
import fetchLatest from "autorelease-task-fetch-latest";
import configureNpm from "autorelease-task-configure-npm";
import prepPublish from "autorelease-task-prep-publish";
import createPipeline from "./pipeline";
import fetchCommits from "./fetch-commits";
import resolveVersion from "autorelease-task-resolve-version";

export default function(autorelease) {
  const pipeline = createPipeline();
  autorelease.add("pre", pipeline);

  // push verify to end of pipeline (no-conflict mode)
  pipeline.pipeline("verify").add(verify);

  // set the remaining tasks by name (overwrite mode)
  pipeline.add("configureNpm", configureNpm)
    .addLernaTask("fetchLatest", fetchLatest, {
      contextKeys: [ "latest" ]
    })
    .add("fetchCommits", fetchCommits)
    .addLernaTask("resolveVersion", resolveVersion, {
      contextKeys: [ "version" ],
      updatedOnly: true
    })
    .addLernaTask("prepPublish", prepPublish, {
      updatedOnly: true,
      forceLoop: true
    });
}
