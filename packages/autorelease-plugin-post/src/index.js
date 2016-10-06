import generateChangelog from "autorelease-task-generate-changelog";

export default function(autorelease) {
  // set the tasks by name (overwrite mode)
  autorelease.pipeline("post")
    .add("generateChangelog", generateChangelog);
}
