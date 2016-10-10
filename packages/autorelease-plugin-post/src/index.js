import generateChangelog from "autorelease-task-generate-changelog";
import writeChangelog from "autorelease-task-write-changelog";
import gitTag from "autorelease-task-git-tag";
import {name,version} from "../package.json";

export default function(autorelease) {
  // add version info
  autorelease.pipeline("version").add(() => {
    console.log("%s %s", name, version);
  });

  // set the tasks by name (overwrite mode)
  autorelease.pipeline("post")
    .add("generateChangelog", generateChangelog)
    .add("writeChangelog", writeChangelog)
    .add("gitTag", gitTag);
}
