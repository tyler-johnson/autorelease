import {writeFile} from "fs-promise";

// write version to the package.json
export default async function(version, {
	package: pkg,
	packageFile: pkgfile
}) {
	pkg.version = version;
	await writeFile(pkgfile, JSON.stringify(pkg, null, 2));
}
