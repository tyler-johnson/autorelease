import {promisify} from "autorelease-utils";
import {resolve,relative} from "path";
import {readFile as _readFile, writeFile as _writeFile} from "fs";

const readFile = promisify(_readFile);
const writeFile = promisify(_writeFile);

export default async function(ctx) {
	const {changelog,basedir=".",options={}} = ctx;
	const {changelogFile="changelog.md"} = options;

	if (typeof changelog !== "string") {
		return;
	}

	// write the changelog to a file
	const cfile = resolve(basedir, changelogFile);
	let existing = "";
	try { existing = await readFile(cfile, "utf-8"); }
	catch(e) { if (e.code !== "ENOENT") throw e; }
	await writeFile(cfile, changelog + existing);

	console.log("Wrote changelog to %s", relative(basedir, cfile));
}
