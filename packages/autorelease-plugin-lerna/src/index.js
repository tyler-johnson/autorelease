import verify from "autorelease-task-verify";
import fetchLatest from "autorelease-task-fetch-latest";
import configureNpm from "autorelease-task-configure-npm";
import createPipeline from "./pipeline";
import fetchCommits from "./fetch-commits";
import resolveVersion from "autorelease-task-resolve-version";
import prepPublish from "./prep-publish";
import generateChangelog from "./generate-changelog";

export default function(autorelease) {
  const pre = createPipeline();
  autorelease.add("pre", pre);

  // push verify to end of pre pipeline (no-conflict mode)
  pre.pipeline("verify").add(verify);

  // set the remaining tasks by name (overwrite mode)
  pre.add("configureNpm", configureNpm)
    .addLernaTask("fetchLatest", fetchLatest, {
      contextKeys: [ "latest" ],
      id: "fetchLatest"
    })
    .add("fetchCommits", fetchCommits)
    .addLernaTask("resolveVersion", resolveVersion, {
      contextKeys: [ "version" ],
      updatedOnly: true
    })
    .add("prepPublish", prepPublish());

  const post = createPipeline();
  autorelease.add("post", post);

  post
    .addLernaTask("fetchLatest", fetchLatest, {
      contextKeys: [ "latest" ],
      id: "fetchLatest"
    })
    .add("generateChangelog", generateChangelog);
}
