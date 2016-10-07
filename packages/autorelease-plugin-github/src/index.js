import gitRemote from "autorelease-task-git-remote";
import createPipeline from "autorelease-pipeline";
import verify from "./verify";
import createRelease from "./create-release";

export default function(autorelease) {
  const verifyPipeline = createPipeline()
    .add(gitRemote)
    .add(verify);

  // verify in standard verification pipeline
  autorelease.pipeline("verify").add(verifyPipeline);

  // run on post-release pipeline
  const post = autorelease.pipeline("post");
  post.pipeline("verify").add(verifyPipeline);
  post.add("githubRelease", createRelease);
}
