import parseCommits from "conventional-commits-parser";
import gitRawCommits from "./git-raw-commits";

export default async function(ctx, gitRawCommitsOpts, parserOpts) {
	const {options={},basedir="."} = ctx;
	const {version,gitRef} = options;
	const latest = ctx.latest || {};
	let gitHead;

	const showRef = async (v) => (await ctx.exec(`git show-ref -s v${v}`)).trim();
	const unsafeShowRef = async (v) => {
		try { return await showRef(v); }
		catch(e) { /* eat errors */ }
	};

	if (latest.gitHead) {
		gitHead = latest.gitHead;
	} else if (gitRef) {
		gitHead = gitRef;
	}

	// sometimes the package file exists but is missing a gitHead reference
	// (looking at you gemfury). will throw an error if the tag doesn't exist.
	else if (latest.version) {
		gitHead = await showRef(latest.version);
	}

	// otherwise attempt to fetch by the passed version
	else if (version) {
		gitHead = await unsafeShowRef(version);
		if (!gitHead) gitHead = await unsafeShowRef(version);
	}

	// grab all raw commits since the last release
	let fetch = gitRawCommits({
		...gitRawCommitsOpts,
		from: gitHead,
		cwd: basedir
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

	return ctx.commits;
}
