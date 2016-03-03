import fs from "fs-promise";
import path from "path";

export default async function(opts) {
	let {basedir=process.cwd()} = opts;
	let pkgfile = path.resolve(basedir, "package.json");
	let pkg = JSON.parse(await fs.readFile(pkgfile, "utf-8"));

	return {
		...opts,
		...pkg.autorelease,
		basedir,
		package: pkg,
		packageFile: pkgfile
	};
}
