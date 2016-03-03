import _gitBranch from "git-branch";
import promisify from "es6-promisify";
const gitBranch = promisify(_gitBranch);
import {isRegExp} from "lodash";

export default async function(r, {branch,basedir="."}) {
	if (branch) {
		let current = await gitBranch(basedir);
		let pass = [].concat(branch).some(b => {
			if (isRegExp(b)) {
				return b.test(current);
			} else if (typeof b === "string") {
				return current === b;
			} else if (typeof b === "function") {
				return b(current);
			}
		});

		if (!pass) {
			throw new Error(`This autorelease was triggered on branch ${current}, which is not a branch autorelease is configured to publish from.`);
		}
	}
}
