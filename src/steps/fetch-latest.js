import fs from "fs-promise";
import path from "path";
import fetchPkg from "package-json";

export default async function(r, {basedir=".",npmtag="latest"}) {
	let pkgfile = path.resolve(basedir, "package.json");
	let pkg = JSON.parse(await fs.readFile(pkgfile, "utf-8"));

	if (!pkg.name) {
		throw new Error("Missing a package name.");
	}

	return await fetchPkg(pkg.name, npmtag);
}
