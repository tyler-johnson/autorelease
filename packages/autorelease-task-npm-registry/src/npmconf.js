import {GLOBAL_NPM_PATH} from "global-npm";

const config = require(GLOBAL_NPM_PATH + "/lib/config/core");

export default function(opts) {
	config.loaded = false;
	return new Promise((resolv, reject) => {
		config.load(opts, (err, conf) => {
			err ? reject(err) : resolv(conf);
		});
	});
}
