import fetch from "./fetch";

export default async function(ctx) {
  const {options={},package:pkg} = ctx;
  const {version="latest",tag} = options;

	const tags = [ version || "latest" ];
	if (tag) tags.unshift(tag);
	ctx.latest = await fetch(pkg, tags);
	return ctx.latest;
}
