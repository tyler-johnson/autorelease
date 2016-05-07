import {resolve} from "path";
import rc from "rc";

export default async function(opts) {
	const {basedir=process.cwd()} = opts;
	const pkgfile = resolve(basedir, "package.json");
	const pkg = require(pkgfile);

	return rc("autorelease", {}, {
		...pkg.autorelease,
		...opts,
		basedir,
		package: pkg,
		packageFile: pkgfile
	});
}
