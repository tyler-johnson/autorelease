export default async function(ctx) {
  if (ctx.dryrun) {
    // simulated publish
    let ver = ctx.version ? ctx.version.next : ctx.package.version;
    return `+ ${ctx.package.name}@${ver}`;
  } else {
    return await ctx.exec("npm publish");
  }
}
