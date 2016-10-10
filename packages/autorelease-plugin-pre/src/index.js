import fetchLatest from "autorelease-task-fetch-latest";
import fetchCommits from "autorelease-task-fetch-commits";
import resolveVersion from "autorelease-task-resolve-version";
import configureNpm from "autorelease-task-configure-npm";
import prepPublish from "autorelease-task-prep-publish";
import {name,version} from "../package.json";

export default function(autorelease) {
  // add version info
  autorelease.pipeline("version").add(() => {
    console.log("%s %s", name, version);
  });

  // set tasks by name (overwrite mode)
  autorelease.pipeline("pre")
    .add("configureNpm", configureNpm)
    .add("fetchLatest", fetchLatest)
    .add("fetchCommits", fetchCommits)
    .add("resolveVersion", resolveVersion)
    .add("prepPublish", prepPublish);
}
