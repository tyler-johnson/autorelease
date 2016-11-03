import verify from "./verify";
import createRelease from "./create-release";
import setup from "./setup";
import {name,version} from "../package.json";

export default function(autorelease) {
  // add version info
  autorelease.pipeline("version").add(() => {
    console.log("%s %s", name, version);
  });

  // verify in standard verification pipeline
  autorelease.pipeline("verify").add("githubVerify", verify);

  // run on post-release pipeline
  autorelease.pipeline("post").add("githubRelease", createRelease);

  // add setup
  autorelease.add("setup.github", setup);
}
