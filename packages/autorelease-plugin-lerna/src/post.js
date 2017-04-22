import fetchLatest from "autorelease-task-fetch-latest";
import createPipeline from "./pipeline";
import generateChangelog from "./tasks/generate-changelog";

export default function() {
  const post = createPipeline();

  post
    .addLernaTask("fetchLatest", fetchLatest, {
      contextKeys: [ "latest" ],
      id: "fetchLatest",
      log: "Fetching latest packages"
    })
    .add("generateChangelog", generateChangelog);

  return post;
}
