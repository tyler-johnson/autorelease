import {writeFile} from "fs-promise";
import getRegistryUrl from "registry-url";
import nerfDart from "nerf-dart";
import npm from "global-npm";
import promisify from "es6-promisify";

const loadNpm = promisify(npm.load.bind(npm));

export default async function(version, {
	npmToken = process.env.NPM_TOKEN,
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

		await loadNpm({});
		npm.config.set(`${nerfDart(registry)}:_authToken`, npmToken, "project");
		await new Promise((resolve, reject) => {
			npm.config.save("project", (err) => err ? reject(err) : resolve());
		});
	}
}
