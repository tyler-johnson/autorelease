import generateChangelog from "autorelease-task-generate-changelog";
import {fetchCommitsContext} from "./fetch-commits";

export default async function(ctx) {
  console.log("Generating changelog from commit messages");

  let newctx = ctx;
  if (ctx.lerna.independent) {
    newctx = await fetchCommitsContext(ctx);
  }

  ctx.changelog = await generateChangelog(newctx);
  return ctx.changelog;
}
