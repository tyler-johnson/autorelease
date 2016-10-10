export default async function(ctx) {
	const {package:pkg={},version} = ctx;
	let ver;

	if (version && version.next) {
		ver = version.next;
	} else if (pkg.version) {
		ver = pkg.version;
	}

	if (!ver) return;

	// tag the current commit with new version
	// done here because github variant tags and releases all-in-one
	await ctx.exec(`git tag -a v${ver} -m ""`);
	return ver;
}
