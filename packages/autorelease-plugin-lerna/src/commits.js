import fetchCommits from "autorelease-task-fetch-commits";
import createPipeline from "./pipeline";
import {exec} from "autorelease-utils";
import {set} from "lodash";

export default function() {
  const pipes = createPipeline();

  pipes.add(async (ctx) => {
    // no packages means this is non-independent mode
    if (!ctx.packages) return;

    // get the newest commit hash out of all packages
    const hashes = (await exec(`git rev-list HEAD`)).split(/\n\r?/g);
    const index = ctx.packages.reduce((newest, pkg) => {
      const {latest} = pkg.autorelease_ctx || {};

      if (latest != null && latest.gitHead) {
        const i = hashes.indexOf(latest.gitHead);
        if (i > newest) newest = i;
      }

      return newest;
    }, -1);
    const gitHead = index >= 0 ? hashes[index] : null;

    if (gitHead != null) {
      ctx.packages.forEach(pkg => {
        set(pkg, "autorelease_ctx.latest.gitHead", gitHead);
      });
    }
  });

  pipes.addLernaTask(function(ctx) {
    console.log(ctx.package.name, ctx.latest.gitHead);
  });

  return pipes;
}
