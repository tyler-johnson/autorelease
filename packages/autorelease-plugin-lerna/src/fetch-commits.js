import fetchCommits from "autorelease-task-fetch-commits";
import {exec} from "autorelease-utils";
// import {set} from "lodash";

export default async function(ctx) {
  // do normal stuff on non-independent
  if (!ctx.independent) {
    await fetchCommits(ctx);
    return;
  }

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

  // generate new context with that gitHead
  const newctx = {
    ...ctx,
    latest: { gitHead }
  };

  // fetch commits
  await fetchCommits(newctx);
  ctx.commits = newctx.commits;
}
