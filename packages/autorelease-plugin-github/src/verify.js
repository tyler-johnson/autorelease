import gitRemote from "autorelease-task-git-remote";

export default async function(ctx) {
	if (ctx._githubVerify) return;
	ctx._githubVerify = true;

  const {options={}} = ctx;
	const gitUrl = await gitRemote(ctx);
	const {githubToken=process.env.GH_TOKEN} = options;

	if (!gitUrl) {
		throw(`No repository url found in package.json.`);
	}

	if (gitUrl.source !== "github.com") {
		throw(`Repository URL does not seem to be from Github: ${gitUrl.toString()}`);
	}

	if (!githubToken) {
		throw("No github token specified.");
	}
}
