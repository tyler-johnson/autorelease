import pre from "./pre";
import publish from "./publish";
import post from "./post";
import {name,version} from "../package.json";

export default function(autorelease) {
  // add version info
  autorelease.pipeline("version").add(() => {
    console.log("%s %s", name, version);
  });

  autorelease.add("pre", pre());
  autorelease.add("publish", publish());
  autorelease.add("post", post());
}
