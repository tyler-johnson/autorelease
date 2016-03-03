import fs from "fs-promise";

export default async function(version, {package:pkg,packageFile:pkgfile}) {
	pkg.version = version;
	await fs.writeFile(pkgfile, JSON.stringify(pkg, null, 2));
}
