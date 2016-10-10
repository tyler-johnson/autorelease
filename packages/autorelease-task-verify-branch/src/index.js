import {isRegExp} from "lodash";
import _gitBranch from "git-branch";
import promisify from "es6-promisify";

const gitBranch = promisify(_gitBranch);

export default async function({ options={}, basedir="." }) {
	if (!options.branch) return;

  const current = await gitBranch(basedir);
  const pass = [].concat(options.branch).some(b => {
    if (isRegExp(b)) {
      return b.test(current);
    } else if (typeof b === "string") {
      return current === b;
    } else if (typeof b === "function") {
      return b(current);
    }
  });

  if (!pass) {
    throw(`This autorelease was triggered on branch ${current}, which is not a branch autorelease is configured to run from.`);
  }
}
