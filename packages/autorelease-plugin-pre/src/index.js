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
    .add("configureNpm", log("Configured NPM for release", configureNpm))
    .add("fetchLatest", log("Fetched the most recent package.json", fetchLatest))
    .add("fetchCommits", log((c) => `Detected ${c.length} new commits since last release`, fetchCommits))
    .add("resolveVersion", log((c) => `Detected ${c.type} version bump to ${c.next}`, resolveVersion))
    .add("prepPublish", log("Saved new version to package.json", prepPublish));
}

function log(msg, fn) {
  return async function(ctx) {
    const r = await fn(ctx);
    console.log(typeof msg === "function" ? msg(r, ctx) : msg);
    return r;
  };
}
