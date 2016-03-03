import {readFile,writeFile} from "fs-promise";
import getRegistryUrl from "registry-url";
import {resolve} from "path";

export default async function(version, {
	npmToken = process.env.NPM_TOKEN,
	basedir = ".",
	package: pkg,
	packageFile: pkgfile
}) {
	// write version to the package.json
	pkg.version = version;
	await writeFile(pkgfile, JSON.stringify(pkg, null, 2));

	// write npm token to the .npmrc file
	if (npmToken) {
		let registry;

		if (pkg.publishConfig && pkg.publishConfig.registry) {
			registry = pkg.publishConfig.registry;
		} else {
			registry = getRegistryUrl(pkg.name.split("/")[0]);
		}

		let npmrc = "";
		let npmrcfile = resolve(basedir, ".npmrc");
		try { npmrc = await readFile(npmrcfile); }
		catch(e) { if (e.code !== "ENOENT") throw e; }

		npmrc = npmrc.trim().replace(/^registry\s*=/gm, function(m) {
			return "#" + m;
		});

		if (npmrc) npmrc += "\n";
		npmrc += `registry=${registry}${registry.substr(-1) !== "/" ? "/" : ""}:_authToken=${npmToken}\n`;

		await writeFile(npmrcfile, npmrc);
	}
}
