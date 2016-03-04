import semver from "semver";

export default async function(pkg) {
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

	if (!type) {
		throw new Error("No relevant changes detected so no version is released.");
	}

	// return the new version
	return pkg.version ? semver.inc(pkg.version, type) : "1.0.0";
}
