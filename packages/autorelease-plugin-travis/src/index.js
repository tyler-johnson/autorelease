import verify from "./verify";
import setup from "./setup";
import {name,version} from "../package.json";

export default function(autorelease) {
  // add version info
  autorelease.pipeline("version").add(() => {
    console.log("%s %s", name, version);
  });

  autorelease.pipeline("verify").add("travisVerify", verify);

  autorelease.add("setup.travis", setup);
}
