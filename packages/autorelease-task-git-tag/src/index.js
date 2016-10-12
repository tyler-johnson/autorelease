export default async function(ctx) {
	const {package:pkg={},version,dryrun} = ctx;
	let ver;

	if (version && version.next) {
		ver = version.next;
	} else if (pkg.version) {
		ver = pkg.version;
	}

	if (!ver) return;

	// tag the current commit with new version
	ver = "v" + ver;
	if (!dryrun) await ctx.exec(`git tag -a ${ver} -m ""`);

	return ver;
}
