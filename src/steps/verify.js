import _gitBranch from "git-branch";
import promisify from "es6-promisify";
const gitBranch = promisify(_gitBranch);
import {isRegExp} from "lodash";

function satisfiesBranch(tests, branch) {
	return [].concat(tests).some(b => {
		if (isRegExp(b)) {
			return b.test(branch);
		} else if (typeof b === "string") {
			return branch === b;
		} else if (typeof b === "function") {
			return b(branch);
		}
	});
}

export default async function(r, opts={}) {
	let {branch,prerelease,basedir="."} = opts;
	let current = await gitBranch(basedir);

	// prerelease as a string is enabled by default
	if (typeof prerelease === "string") {
		prerelease = {
			id: prerelease,
			enabled: true
		};
	}

	// toggle prerelease if prerelease branch matches
	if (prerelease.branch) {
		prerelease.enabled = satisfiesBranch(prerelease.branch, current);
	}

	// throw branch error only if not in prerelease and branch doesn't match
	if (!prerelease.enabled && branch && !satisfiesBranch(branch, current)) {
		throw new Error(`This autorelease was triggered on branch ${current}, which is not a branch autorelease is configured to publish from.`);
	}

	opts.prerelease = prerelease;
}
