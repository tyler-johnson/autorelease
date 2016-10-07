import verify from "./verify";
import {addVersion} from "autorelease-utils";
import {name,version} from "../package.json";

export default function(autorelease) {
  // add version info
  addVersion(autorelease, name, version);

  autorelease.pipeline("verify").add(verify);
}
