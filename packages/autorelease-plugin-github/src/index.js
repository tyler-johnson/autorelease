import verify from "./verify";
import createRelease from "./create-release";
import {name,version} from "../package.json";

export default function(autorelease) {
  // add version info
  autorelease.pipeline("version").add(() => {
    console.log("%s %s", name, version);
  });

  // verify in standard verification pipeline
  autorelease.pipeline("verify").add("githubVerify", verify);

  // run on post-release pipeline
  const post = autorelease.pipeline("post");
  post.add("githubVerify", verify);
  post.add("githubRelease", createRelease);
}
