import pre from "autorelease-plugin-pre";
import post from "autorelease-plugin-post";
import verifyBranch from "autorelease-task-verify-branch";
import npmPublish from "autorelease-task-npm-publish";
import {name,version} from "../package.json";

export default function(autorelease) {
  // add version info
  autorelease.pipeline("version").add(() => {
    console.log("%s %s", name, version);
  });

  // add a setup task to set package.json script
  autorelease.add("setup.core", (ctx) => {
    ctx.script.before("verify");
    ctx.script.publish("publish");
  });

  // attach branch verification
  autorelease.pipeline("verify").add("branch", verifyBranch);

  // attach pre plugin
  pre(autorelease);

  // attach npm publish
  autorelease.pipeline("publish").add("npm", npmPublish);

  // attach post plugin
  post(autorelease);
}
