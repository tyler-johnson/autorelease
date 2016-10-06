import gitRemote from "autorelease-task-git-remote";
import createPipeline from "autorelease-pipeline";
import verify from "./verify";
import createRelease from "./create-release";

export default function(autorelease) {
  const verifyPipeline = createPipeline()
    .add(gitRemote)
    .add(verify);

  autorelease.pipeline("pre.verify").add(verifyPipeline);

  const post = autorelease.pipeline("post");
  post.pipeline("verify").add(verifyPipeline);
  post.add("githubRelease", createRelease);
}
