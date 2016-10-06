import generateChangelog from "autorelease-task-generate-changelog";
import writeChangelog from "autorelease-task-write-changelog";
import gitTag from "autorelease-task-git-tag";

export default function(autorelease) {
  // set the tasks by name (overwrite mode)
  autorelease.pipeline("post")
    .add("generateChangelog", generateChangelog)
    .add("writeChangelog", writeChangelog)
    .add("gitTag", gitTag);
}
