import parseCommits from "conventional-commits-parser";
import gitRawCommits from "git-raw-commits";
import {exec,unsafeExec} from "autorelease-utils";

export default async function(ctx) {
	const {latest={},options={}} = ctx;
	const {version,gitRef,gitRawCommitsOpts,parserOpts} = options;
	let gitHead;

	if (latest.gitHead) {
		gitHead = latest.gitHead;
	} else if (gitRef) {
		gitHead = gitRef;
	}

	// sometimes the package file exists but is missing a gitHead reference
	// (looking at you gemfury). will throw an error if the tag doesn't exist.
	else if (latest.version) {
		gitHead = (await exec(`git show-ref -s v${latest.version}`)).trim();
	}

	// otherwise attempt to fetch by the passed version
	else if (version) {
		gitHead = (await unsafeExec(`git show-ref -s ${version}`)).trim();
		if (!gitHead) gitHead = (await unsafeExec(`git show-ref -s v${version}`)).trim();
	}

	// grab all raw commits since the last release
	let fetch = gitRawCommits({
		...gitRawCommitsOpts,
		from: gitHead
	});

	// parse commits like the changelog
	ctx.commits = [];
	let parser = fetch.pipe(parseCommits(parserOpts));
	parser.on("data", (r) => ctx.commits.push(r));

	// wait for the fetch/parse process to complete
	await new Promise(function(resolve, reject) {
		parser.on("end", resolve);
		parser.on("error", reject);
		fetch.on("error", reject);
	});

	console.log("Detected %s new commits", ctx.commits.length);
}
