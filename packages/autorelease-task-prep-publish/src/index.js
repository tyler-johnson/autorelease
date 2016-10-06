import {writeFile} from "fs";
import {relative} from "path";

// write version to the package.json
export default async function(ctx) {
	const {version,package:pkg={},packageFile,tag} = ctx;
	const wrote = {};

	// set the correct dist tag
	if (tag) {
		if (pkg.publishConfig == null) pkg.publishConfig = {};
		pkg.publishConfig.tag = tag;
		wrote.tag = true;
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

	if (wrote.tag || wrote.ver) {
		// write the package file
		await new Promise((resolve, reject) => {
			writeFile(packageFile, JSON.stringify(pkg, null, 2) + "\n", (err) => {
				err ? reject(err) : resolve();
			});
		});

		let log = "Wrote ";
		const logargs = [];

		if (wrote.tag) log += "tags";
		if (wrote.tag && wrote.ver) log += " and ";
		if (wrote.ver) {
			log += "%s version";
			logargs.push(version ? version.next : "empty");
		}

		log += " to %s";
		logargs.push(relative((ctx.parentContext && ctx.parentContext.basedir) || ctx.basedir || ".", packageFile));

		console.log(log, ...logargs);
	}
}
