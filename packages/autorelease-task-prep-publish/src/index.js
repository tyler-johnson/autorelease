import {writeFile} from "fs";

// write version to the package.json
export default async function(ctx) {
	const {version,package:pkg={},packageFile,tag} = ctx;
	if (!version) return;

	// set the correct dist tag
	if (tag) {
		if (pkg.publishConfig == null) pkg.publishConfig = {};
		pkg.publishConfig.tag = tag;
	}

	// set new version
	pkg.version = version;

	// write the package file
	await new Promise((resolve, reject) => {
		writeFile(packageFile, JSON.stringify(pkg, null, 2), (err) => {
			err ? reject(err) : resolve();
		});
	});
}
