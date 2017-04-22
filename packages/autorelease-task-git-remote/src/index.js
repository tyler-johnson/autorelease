import gitUrlParse from "git-url-parse";

export default async function(ctx) {
	if (ctx.gitUrl) return ctx.gitUrl;
	const {package:pkg} = ctx;

	// attempt to find repo url from the package.json
  let repourl = pkg && pkg.repository && pkg.repository.url;

	// otherwise look in git remotes
	if (!repourl) {
		const rsrc = await ctx.exec("git remote -v");
		
		const remotes = rsrc.split(/\r?\n/g)
			.map(l => l.trim())
			.filter(l => l.match(/\(fetch\)$/))
			.map(l => l.split(/\s+/g).slice(0,2))
			.filter(l => l.length >= 2);

		if (remotes.length && !remotes.some((r) => {
			if (r[0] === "origin") {
				repourl = r[1];
				return true;
			}
		})) {
			repourl = remotes[0][1];
		}
	}

	if (!repourl) return;
	ctx.gitUrl = gitUrlParse(repourl);
	return ctx.gitUrl;
}