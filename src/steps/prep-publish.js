import {writeFile} from "fs-promise";

// write version to the package.json
export default async function(version, {
	tag,
	package: pkg,
	packageFile: pkgfile
}) {
	// set the correct dist tag
	if (tag) {
		if (pkg.publishConfig == null) pkg.publishConfig = {};
		pkg.publishConfig.tag = tag;
	}

	// set new version
	pkg.version = version;

	// write the package file
	await writeFile(pkgfile, JSON.stringify(pkg, null, 2));
}
