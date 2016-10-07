import fetch from "./fetch";

export default async function(ctx) {
  const {options={},package:pkg} = ctx;
  const {version="latest",tag} = options;

	const tags = [ version || "latest" ];
	if (tag) tags.unshift(tag);
	ctx.latest = await fetch(pkg, tags);

	if (ctx.latest && ctx.latest.version) {
		console.log("Fetched %s@%s", ctx.latest.name, ctx.latest.version);
	}
}
