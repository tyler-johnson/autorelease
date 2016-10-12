import getRegistryUrl from "autorelease-task-npm-registry";
import {GLOBAL_NPM_PATH} from "global-npm";
import {resolve} from "path";

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
	const {options={},basedir,dryrun} = ctx;
	const {npmToken=process.env.NPM_TOKEN} = options;
	if (!npmToken) return;

	const registry = getRegistryUrl(ctx);
	if (!registry) return;

	if (!dryrun) {
		const conf = await loadConfig({ prefix: basedir });
		conf.set(`${registry}:_authToken`, npmToken, "project");
		await new Promise((resolv, reject) => {
			conf.save("project", (err) => err ? reject(err) : resolv());
		});
	}

	return resolve(basedir, ".npmrc");
}
