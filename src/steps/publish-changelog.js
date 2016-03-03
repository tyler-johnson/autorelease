import {exec as _exec} from "child_process";
import promisify from "es6-promisify";
import fs from "fs-promise";

const exec = promisify(_exec, function(err, res) {
	if (err) this.reject(err);
	else this.resolve(Array.isArray(res) ? res[0] : res);
});

export default async function(log, {package:pkg}) {
	await exec(`git tag -a v${pkg.version} -m ""`);
	await fs.writeFile("changelog.md", log, { flag: "a" });
	await exec(`git add changelog.md`);
	await exec(`git commit -m "chore: updated changelog for v${pkg.version}"`);
}
