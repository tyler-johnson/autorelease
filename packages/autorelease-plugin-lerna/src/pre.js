import configureNpm from "autorelease-task-configure-npm";
import resolveVersion from "autorelease-task-resolve-version";
import fetchLatest from "autorelease-task-fetch-latest";
import fetchCommits from "./tasks/fetch-commits";
import prepPublish from "./tasks/prep-publish";
import createPipeline from "./pipeline";

export default function() {
  const pre = createPipeline();

  // set the remaining tasks by name (overwrite mode)
  pre.addLernaTask("configureNpm", configureNpm, {
      forceLoop: true
    })
    .addLernaTask("fetchLatest", fetchLatest, {
      contextKeys: [ "latest" ],
      id: "fetchLatest"
    })
    .add("fetchCommits", fetchCommits)
    .addLernaTask("resolveVersion", resolveVersion, {
      contextKeys: [ "version" ],
      updatedOnly: true
    })
    .add("prepPublish", prepPublish);

  return pre;
}
