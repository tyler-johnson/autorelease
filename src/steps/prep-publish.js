import {writeFile} from "fs-promise";
import SemVer from "semver";

// write version to the package.json
export default async function(version, {
	tag,
	package: pkg,
	packageFile: pkgfile
}) {
	version = new SemVer(version);

	// set the correct dist tag
	if (tag || version.prerelease.length) {
		if (pkg.publishConfig == null) pkg.publishConfig = {};
		pkg.publishConfig.tag = tag || "edge";
	}

	pkg.version = version.toString();
	await writeFile(pkgfile, JSON.stringify(pkg, null, 2));
}
