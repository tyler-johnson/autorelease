import gitUrlParse from "git-url-parse";
import _gitRemotes from "git-remotes";
import promisify from "es6-promisify";

const gitRemotes = promisify(_gitRemotes);

export default async function(ctx) {
	const {package:pkg,basedir="."} = ctx;

	// attempt to find repo url from the package.json
  let repourl = pkg && pkg.repository && pkg.repository.url;

	// otherwise look in git remotes
	if (!repourl) {
    const remotes = await gitRemotes(basedir);
		if (remotes.length && !remotes.some((r) => {
			if (r.name === "origin") {
				repourl = r.url;
				return true;
			}
		})) {
			repourl = remotes[0].url;
		}
	}

	if (!repourl) return;
	ctx.gitUrl = gitUrlParse(repourl);
	return ctx.gitUrl;
}
