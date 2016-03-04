import exec from "../utils/exec";
import parseCommits from "conventional-commits-parser";
import gitRawCommits from "git-raw-commits";

export default async function(pkg={}) {
	// sometimes the package file exists but is missing a gitHead reference
	// (looking at you gemfury). will throw an error if the tag doesn't exist.
	if (pkg.version && !pkg.gitHead) {
		pkg.gitHead = (await exec(`git show-ref -s v${pkg.version}`)).trim();
	}

	// grab all raw commits since the last release
	let fetch = gitRawCommits({
		from: pkg.gitHead
	});

	// parse commits like the changelog
	pkg.commits = [];
	let parser = fetch.pipe(parseCommits());
	parser.on("data", (r) => pkg.commits.push(r));

	// wait for the fetch/parse process to complete
	await new Promise(function(resolve, reject) {
		parser.on("end", resolve);
		parser.on("error", reject);
		fetch.on("error", reject);
	});

	return pkg;
}
