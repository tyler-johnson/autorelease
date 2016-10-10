import generateChangelog from "autorelease-task-generate-changelog";
import {fetchCommitsContext} from "./fetch-commits";

export default async function(ctx) {
  let newctx = ctx;
  if (ctx.independent) {
    newctx = await fetchCommitsContext(ctx);
  }

  ctx.changelog = await generateChangelog(newctx);
  return ctx.changelog;
}
