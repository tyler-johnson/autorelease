import fetchCommits from "autorelease-task-fetch-commits";

export async function newestCommitHash(packages, exec) {
  // get the newest commit hash out of all packages
  const hashes = (await exec(`git rev-list HEAD`)).split(/\n\r?/g);

  const index = packages.reduce((newest, pkg) => {
    const {latest} = pkg.autorelease_ctx || {};

    if (latest != null && latest.gitHead) {
      const i = hashes.indexOf(latest.gitHead);
      if (i > newest) newest = i;
    }

    return newest;
  }, -1);

  return index >= 0 ? hashes[index] : null;
}

export default async function(ctx) {
  // do normal stuff on non-independent
  if (!ctx.lerna.independent) return await fetchCommits(ctx);

  // fetch commits
  const gitHead = await newestCommitHash(ctx.lerna.packages, ctx.exec.bind(ctx));
  ctx.commits = await fetchCommits({
    ...ctx,
    latest: { gitHead }
  });

  console.log("Detected %s new commits%s", ctx.commits.length, gitHead ? ` (since ${gitHead.substr(0, 8)})` : "");
  return ctx.commits;
}
