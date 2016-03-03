import parseRawCommit from "conventional-commits-parser/lib/parser";
import promisify from "es6-promisify";
import _gitBranch from "git-branch";
import {exec as _exec} from "child_process";
import semver from "semver";

const gitBranch = promisify(_gitBranch);
const exec = promisify(_exec, function(err, res) {
	if (err) this.reject(err);
	else this.resolve(Array.isArray(res) ? res[0] : res);
});

async function getCommits(head, branch) {
	let range = (head ? head + '..' : '') + 'HEAD';
	let inHistory = false;

	try {
		let stdout = await exec(`git branch --contains ${head}`);
		if (stdout) inHistory = stdout.split('\n').some((res) => {
			return branch === res.replace('*', '').trim();
		});
	} catch(e) { e; }

	if (!inHistory) {
		throw new Error('Commit not in history');
	}

	let stdout = await exec(`git log -E --format=%H==SPLIT==%B==END== ${range}`);
	return stdout.split('==END==\n').filter((raw) => !!raw.trim()).map((raw) => {
		let [hash,message] = raw.split('==SPLIT==');
		return {hash,message};
	});
}

export default async function(pkg, {basedir="."}) {
	let commits = await getCommits(pkg.gitHead, await gitBranch(basedir));

	if (!commits.length) {
		throw new Error("There are no relevant changes, so no new version is released.");
	}

	let type = null;

	commits
		.map(({hash,message}) => parseRawCommit(`${hash}\n${message}`))
		.filter(Boolean)
		.every((commit) => {
			if (commit.breaks.length) {
				type = "major";
				return false;
			}
			if (commit.type === "feat") type = "minor";
			if (!type && commit.type === "fix") type = "patch";
			return true;
		});

	console.log(type, semver.inc(pkg.version, type));
}
