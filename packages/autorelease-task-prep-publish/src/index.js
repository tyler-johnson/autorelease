import {writeFile} from "fs";
import {relative} from "path";

// write version to the package.json
export default async function(ctx) {
	const {version,package:pkg={},packageFile,tag,publishConfig} = ctx;
	const wrote = {};

	// set the correct dist tag
	if (tag || publishConfig) {
		if (pkg.publishConfig == null) pkg.publishConfig = {};
		Object.assign(pkg.publishConfig, publishConfig);
		if (tag) pkg.publishConfig.tag = tag;
		wrote.pconf = true;
	}

	// set new version
	if (version && version.next) {
		pkg.version = version.next;
		wrote.ver = true;
	}

	// or remove it all together
	// this is so a new git tag is not created since there was no new version
	else {
		pkg.version = void 0;
		wrote.ver = true;
	}

	if (wrote.pconf || wrote.ver) {
		// write the package file
		await new Promise((resolve, reject) => {
			writeFile(packageFile, JSON.stringify(pkg, null, 2) + "\n", (err) => {
				err ? reject(err) : resolve();
			});
		});

		let log = "Wrote ";
		const logargs = [];

		if (wrote.pconf) log += "publish config";
		if (wrote.pconf && wrote.ver) log += " and ";
		if (wrote.ver) {
			log += "version %s";
			logargs.push(version ? version.next : "empty");
		}

		log += " to %s";
		logargs.push(relative((ctx.parentContext && ctx.parentContext.basedir) || ctx.basedir || ".", packageFile));

		console.log(log, ...logargs);
	}
}
