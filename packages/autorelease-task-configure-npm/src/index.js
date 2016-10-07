import {getRegistryUrl} from "autorelease-utils";
import {GLOBAL_NPM_PATH} from "global-npm";
import {resolve,relative} from "path";

const config = require(GLOBAL_NPM_PATH + "/lib/config/core");

function loadConfig(opts) {
	config.loaded = false;
	return new Promise((resolv, reject) => {
		config.load(opts, (err, conf) => {
			err ? reject(err) : resolv(conf);
		});
	});
}

// write npm token to the .npmrc file
export default async function(ctx) {
	const {options={},package:pkg={},basedir} = ctx;
	const {npmToken=process.env.NPM_TOKEN} = options;
	if (!npmToken) return;

	const registry = getRegistryUrl(pkg);
	const conf = await loadConfig({ prefix: basedir });
	conf.set(`${registry}:_authToken`, npmToken, "project");
	await new Promise((resolv, reject) => {
		conf.save("project", (err) => err ? reject(err) : resolv());
	});

	const npmrc = resolve(basedir, ".npmrc");
	const relfile = relative((ctx.parentContext && ctx.parentContext.basedir) || ctx.basedir || ".", npmrc);
	console.log("Wrote NPM_TOKEN to %s", relfile);
}
