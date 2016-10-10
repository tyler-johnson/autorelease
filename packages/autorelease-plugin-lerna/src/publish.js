export default async function(ctx) {
  return await ctx.exec("npm publish");
}
