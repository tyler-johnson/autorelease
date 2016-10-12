import generateChangelog from "autorelease-task-generate-changelog";
import writeChangelog from "autorelease-task-write-changelog";
import gitTag from "autorelease-task-git-tag";
import {name,version} from "../package.json";
import {relative} from "path";

export default function(autorelease) {
  // add version info
  autorelease.pipeline("version").add(() => {
    console.log("%s %s", name, version);
  });

  // set the tasks by name (overwrite mode)
  autorelease.pipeline("post")
    .add("generateChangelog", log("Generated changelog from commit messages", generateChangelog))
    .add("writeChangelog", log((c, {basedir}) => `Wrote changelog to ${relative(basedir, c)}`, writeChangelog))
    .add("gitTag", log((c) => `Created new git tag ${c}`, gitTag));
}

function log(msg, fn) {
  return async function(ctx) {
    const r = await fn(ctx);
    console.log(typeof msg === "function" ? msg(r, ctx) : msg);
    return r;
  };
}
