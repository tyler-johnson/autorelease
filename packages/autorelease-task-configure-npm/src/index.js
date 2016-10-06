import getRegistryUrl from "registry-url";
import nerfDart from "nerf-dart";
import {GLOBAL_NPM_PATH} from "global-npm";

const config = require(GLOBAL_NPM_PATH + "/lib/config/core");

function loadConfig() {
	return new Promise((resolve, reject) => {
		config.load((err, conf) => {
			err ? reject(err) : resolve(conf);
		});
	});
}

// write npm token to the .npmrc file
export default async function(ctx) {
	const {options={},package:pkg={}} = ctx;
	const {npmToken=process.env.NPM_TOKEN} = options;
	if (!npmToken) return;

	let registry;

	if (pkg.publishConfig && pkg.publishConfig.registry) {
		registry = pkg.publishConfig.registry;
	} else {
		registry = getRegistryUrl(pkg.name.split("/")[0]);
	}

	const conf = await loadConfig();
	conf.set(`${nerfDart(registry)}:_authToken`, npmToken, "project");
	await new Promise((resolve, reject) => {
		conf.save("project", (err) => err ? reject(err) : resolve());
	});
}
