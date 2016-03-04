import parseCommits from "conventional-commits-parser";
import gitRawCommits from "git-raw-commits";

export default async function(pkg) {
	// grab all raw commits since the last release
	let fetch = gitRawCommits({
		from: pkg ? pkg.gitHead : null
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
