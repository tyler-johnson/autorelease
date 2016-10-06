import SemVer from "semver";

export default function(ctx) {
	const {commits=[],latest,options={}} = ctx;
	const {version, prerelease} = options;

	// calculate how the version should change
	let type = null;
	commits.filter(Boolean).every((commit) => {
		if (commit.notes.some((n) => n.title === "BREAKING CHANGE")) {
			type = "major";
			return false;
		}
		if (commit.type === "feat") type = "minor";
		if (!type && commit.type === "fix") type = "patch";
		return true;
	});

	// get the base version
	let hasChanges = Boolean(type);
	let last = latest != null && latest.version ? latest.version : version;
	let base = null;
	let pre = null;

	// base version must be valid, otherwise major version bump from 0.0.0
	if (SemVer.valid(last)) {
		base = new SemVer(last);
	} else {
		type = "major";
		base = new SemVer("0.0.0");
	}

	// if last version was a prerelease, it is okay to release without changes
	if (!hasChanges && (prerelease || base.prerelease.length === 0)) {
		throw new Error("No relevant changes detected so no version is released.");
	} else if (!type) {
		type = "patch";
	}

	// prerelease if desired
	if (prerelease) {
		// pre+ if last version was not a prerelease
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

	ctx.version = {
		type, pre,
		previous: last,
		next: base.toString()
	};

	console.log("%s: %s version bump to %s", ctx.package.name, type, ctx.version.next);
}
