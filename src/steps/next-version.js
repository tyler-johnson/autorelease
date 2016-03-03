import parseCommits from "conventional-commits-parser";
import semver from "semver";
import gitRawCommits from "git-raw-commits";

export default async function(pkg) {
	// grab all raw commits since the last release
	let fetch = gitRawCommits({
		from: pkg ? pkg.gitHead : null
	});

	// parse commits like the changelog
	let commits = [];
	let parser = fetch.pipe(parseCommits());
	parser.on("data", (r) => commits.push(r));

	// wait for the fetch/parse process to complete
	await new Promise(function(resolve, reject) {
		parser.on("end", resolve);
		parser.on("error", reject);
		fetch.on("error", reject);
	});

	// calculate how the version should change
	let type = null;
	commits.filter(Boolean).every((commit) => {
		if (commit.notes.some((n) => n.title === "BREAKING CHANGE")) {
			type = "major";
			return false;
		}
		if (commit.type === "feat") type = "minor";
		if (!type && commit.type === "fix") type = "patch";
		return true;
	});

	if (!type) {
		throw new Error("No relevant changes detected so no version is released.");
	}

	// return the new version
	return pkg ? semver.inc(pkg.version, type) : "1.0.0";
}
