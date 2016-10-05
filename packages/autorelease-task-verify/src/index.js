import _gitBranch from "git-branch";
import {isRegExp} from "lodash";

function gitBranch(dir) {
  return new Promise((resolve, reject) => {
    _gitBranch(dir, (err, r) => {
      err ? reject(err) : resolve(r);
    });
  });
}

export default async function({ options={}, basedir="." }) {
	if (!options.branch) return;

  let current = await gitBranch(basedir);
  let pass = [].concat(options.branch).some(b => {
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
