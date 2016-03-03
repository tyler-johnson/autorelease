import fs from "fs-promise";
import {resolve} from "path";

export default async function(opts) {
	let {basedir=process.cwd()} = opts;
	let pkgfile = resolve(basedir, "package.json");
	let pkg = JSON.parse(await fs.readFile(pkgfile, "utf-8"));

	let rc;
	try {
		rc = await fs.readFile(resolve(basedir, ".autoreleaserc"), "utf-8");
	} catch(e) {
		if (e.code !== "ENOENT") throw e;
	}

	if (rc) rc = JSON.parse(rc);

	return {
		...opts,
		...pkg.autorelease,
		...rc,
		basedir,
		package: pkg,
		packageFile: pkgfile
	};
}
