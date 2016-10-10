import {writeFile} from "fs";

// write version to the package.json
export default async function(ctx) {
	const {version,package:pkg,packageFile,tag} = ctx;

	// clone the package data so we don't affect the existing
	const pkgdata = { ...pkg };

	// set the correct dist tag
	if (tag) {
		pkgdata.publishConfig = {
			...pkgdata.publishConfig,
			tag: tag
		};
	}

	// set new version or remove it all together
	// this is so a new git tag is not created since there was no new version
	pkgdata.version = version && version.next ? version.next : void 0;

	// write the package file
	await new Promise((resolve, reject) => {
		writeFile(packageFile, JSON.stringify(pkgdata, null, 2) + "\n", (err) => {
			err ? reject(err) : resolve();
		});
	});

	return pkgdata;
}
