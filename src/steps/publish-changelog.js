import {exec as _exec} from "child_process";
import promisify from "es6-promisify";
import {readFile,writeFile} from "fs-promise";
import {resolve} from "path";

const exec = promisify(_exec, function(err, res) {
	if (err) this.reject(err);
	else this.resolve(Array.isArray(res) ? res[0] : res);
});

export default async function(log, {package:pkg,basedir="."}) {
	// tag the current commit with new version
	// done here because github variant tags and releases all-in-one
	await exec(`git tag -a v${pkg.version} -m ""`);

	// write the changelog to a file
	if (typeof log === "string") {
		let cfile = resolve(basedir, "changelog.md");
		let existing = "";
		try { existing = await readFile(cfile, "utf-8"); }
		catch(e) { if (e.code !== "ENOENT") throw e; }
		await writeFile(cfile, existing + log);
	}
}
