import nerfDart from "nerf-dart";
import loadNpmConf from "./npmconf";

export default async function(ctx) {
	const {package:pkg,basedir} = ctx;
	let registry;

	if (pkg.publishConfig && pkg.publishConfig.registry) {
		registry = pkg.publishConfig.registry;
	} else {
		const conf = await loadNpmConf({ prefix: basedir });
		const name = pkg.name.split("/")[0];
		if (name[0] === "@") registry = conf.get(name + ":registry", "project");
		if (!registry) registry = conf.get("registry", "project");
	}

	if (!registry) registry = "https://registry.npmjs.org/";
	ctx.registry = nerfDart(registry);
	return ctx.registry;
}
