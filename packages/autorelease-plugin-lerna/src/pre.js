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
      forceLoop: true,
      log: "Configuring NPM for release"
    })
    .addLernaTask("fetchLatest", fetchLatest, {
      contextKeys: [ "latest" ],
      id: "fetchLatest",
      log: "Fetching latest packages"
    })
    .add("fetchCommits", fetchCommits)
    .addLernaTask("resolveVersion", resolveVersion, {
      contextKeys: [ "version" ],
      updatedOnly: true,
      log: "Determining new package versions from commit messages"
    })
    .add("prepPublish", prepPublish);

  return pre;
}
