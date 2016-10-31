import {GLOBAL_NPM_PATH} from "global-npm";
import fs from "fs";
import promisify from "es6-promisify";
import {join} from "path";

const config = require(GLOBAL_NPM_PATH + "/lib/config/core");
const stat = promisify(fs.stat);
const rmdir = promisify(fs.rmdir);
const load = promisify(config.load);

export default async function(opts) {
	config.loaded = false;
	const r = await load(opts);

	// delete the eroneous 'etc/' folder that is created by npm
	if (opts.prefix) {
		try {
			const etc = join(opts.prefix, "etc");
			const s = await stat(etc);
			if (s.isDirectory()) await rmdir(etc);
		} catch(e) {
			if (e.code !== "ENOENT") throw e;
		}
	}

	return r;
}
