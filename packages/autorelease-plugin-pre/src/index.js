import verify from "autorelease-task-verify";
import fetchLatest from "autorelease-task-fetch-latest";
import fetchCommits from "autorelease-task-fetch-commits";
import resolveVersion from "autorelease-task-resolve-version";
import configureNpm from "autorelease-task-configure-npm";
import prepPublish from "autorelease-task-prep-publish";

export default function(autorelease) {
  autorelease.pipeline("pre")
    .add("verify", verify)
    .add("configureNpm", configureNpm)
    .add("fetchLatest", fetchLatest)
    .add("fetchCommits", fetchCommits)
    .add("resolveVersion", resolveVersion)
    .add("prepPublish", prepPublish);
}
