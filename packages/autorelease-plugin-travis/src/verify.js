import {has,isRegExp} from "lodash";
import travisAfterAll from "travis-after-all";

export default async function(ctx) {
	const {options={}} = ctx;
	const {branch,travis={}} = options;

	if (process.env.TRAVIS !== "true") {
		throw("This is not running on Travis CI and therefore a new version won't be published.");
	}

	if (!ctx.dryrun && has(process.env, "TRAVIS_PULL_REQUEST") && process.env.TRAVIS_PULL_REQUEST !== "false") {
		throw("This release was triggered by a pull request and therefore a new version won't be published.");
	}

	if (process.env.TRAVIS_TAG) {
		throw("This release was triggered by a git tag and therefore a new version won't be published.");
	}

	if (branch) {
		let current = process.env.TRAVIS_BRANCH;
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
			throw(`This autorelease was triggered on branch ${current}, which is not a branch autorelease is configured to publish from.`);
		}
	}

	if (travis.waitForJobs !== false) {
		await new Promise((resolve, reject) => {
			travisAfterAll((code, err) => {
				if (err) return reject(err);

				if (code === 0) return resolve();
				else if (code === 1) {
					return reject("In this run not all jobs passed and therefore a new version won't be published.");
				}
				else if (code === 2) {
					return reject("This release is not the build leader and therefore a new version won't be published.");
				}
				else {
					return reject("Unkown travis-after-all error");
				}
			});
		});
	}
}
