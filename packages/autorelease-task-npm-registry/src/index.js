import registryUrl from "registry-url";
import nerfDart from "nerf-dart";

export default function(ctx) {
	const {package:pkg} = ctx;
	let registry;

	if (pkg.publishConfig && pkg.publishConfig.registry) {
		registry = pkg.publishConfig.registry;
	} else {
		registry = registryUrl(pkg.name.split("/")[0]);
	}

	if (!registry) return;
	ctx.registry = nerfDart(registry);
	return ctx.registry;
}
