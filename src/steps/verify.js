import _gitBranch from "git-branch";
import promisify from "es6-promisify";
const gitBranch = promisify(_gitBranch);
import {isRegExp} from "lodash";

export default async function(r, {branch,basedir="."}) {
	if (branch) {
		let current = await gitBranch(basedir);
		let pass = true;

		if (isRegExp(branch)) {
			pass = branch.test(current);
		} else if (typeof branch === "string") {
			pass = current === branch;
		} else if (typeof branch === "function") {
			pass = await branch(current);
		}

		if (!pass) {
			throw new Error(`This autorelease was triggered on branch ${current}, which is not a branch autorelease is configured to publish from.`);
		}
	}
}
