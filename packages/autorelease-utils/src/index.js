import _gitBranch from "git-branch";
import {exec as _exec} from "child_process";

export function gitBranch(dir) {
  return new Promise((resolve, reject) => {
    _gitBranch(dir, (err, r) => {
      err ? reject(err) : resolve(r);
    });
  });
}

export function exec(...args) {
	return new Promise((resolve, reject) => {
		_exec.apply(null, args.concat(function(err, stdout) {
			err ? reject(err) : resolve(stdout);
		}));
	});
}

export async function unsafeExec(...args) {
	try {
		await exec(...args);
	} catch(e) {
		// eat errors
	}
}
