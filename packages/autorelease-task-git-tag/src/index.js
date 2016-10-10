export default async function(ctx) {
	const {package:pkg={}} = ctx;

	// tag the current commit with new version
	// done here because github variant tags and releases all-in-one
	await ctx.exec(`git tag -a v${pkg.version} -m ""`);
}
