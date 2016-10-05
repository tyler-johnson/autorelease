import verify from "autorelease-task-verify";
import fetchLatest from "autorelease-task-fetch-latest";
import fetchCommits from "autorelease-task-fetch-commits";

export default function(autorelease) {
  autorelease.pipeline("pre")
    .add("verify", verify)
    .add("fetchLatest", fetchLatest)
    .add("fetchCommits", fetchCommits);
}
