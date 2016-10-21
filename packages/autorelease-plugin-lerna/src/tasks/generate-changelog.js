import generateChangelog from "autorelease-task-generate-changelog";
import {newestCommitHash} from "./fetch-commits";

export default async function(ctx) {
  console.log("Generating changelog from commit messages");

  let newctx = ctx;
  if (ctx.lerna.independent) {
    const gitHead = await newestCommitHash(ctx.lerna.packages, ctx.exec.bind(ctx));
    newctx = { ...ctx, latest: { gitHead } };
  }

  ctx.changelog = await generateChangelog(newctx);
  return ctx.changelog;
}
