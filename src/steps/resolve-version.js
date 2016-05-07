import SemVer from "semver";

export default async function(pkg, { version, prerelease }) {
	// calculate how the version should change
	let type = null;
	pkg.commits.filter(Boolean).every((commit) => {
		if (commit.notes.some((n) => n.title === "BREAKING CHANGE")) {
			type = "major";
			return false;
		}
		if (commit.type === "feat") type = "minor";
		if (!type && commit.type === "fix") type = "patch";
		return true;
	});

	// don't release if there are commits that warrant a version bump
	if (!type) {
		throw new Error("No relevant changes detected so no version is released.");
	}

	// get the base version
	let last = pkg.version || version;
	let base = null;

	// base version must be valid, otherwise major version bump from 0.0.0
	if (SemVer.valid(last)) {
		base = new SemVer(last);
	} else {
		type = "major";
		base = new SemVer("0.0.0");
	}

	// prerelease if desired
	let pre = null;
	if (prerelease) {
		// prepatch if last version was a prerelase too
		if (base.prerelease.length === 0) {
			type = "pre" + type;
		} else {
			type = "prerelease";
		}

		if (typeof prerelease === "string" && prerelease !== "") {
			pre = prerelease;
		}
	}

	base.inc(type, pre);
	return base.toString();
}
