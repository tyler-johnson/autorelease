import _gitHead from "git-head";
import GitHub from "github";
import {resolve} from "path";
import url from "url";
import promisify from "es6-promisify";
import gitRemote from "autorelease-task-git-remote";

const gitHead = promisify(_gitHead);

export default async function(ctx) {
  const {
    basedir = ".",
    package: pkg,
    version,
    options = {},
    changelog = "",
    dryrun
  } = ctx;

  const ver = version ? version.next : pkg.version;
  if (!ver) return;

  const gitUrl = await gitRemote(ctx);
  const head = await gitHead(resolve(basedir, ".git"));

  if (!dryrun) {
    const {
      githubUrl = process.env.GH_URL,
      githubToken = process.env.GH_TOKEN,
      githubApiPathPrefix,
      draftMode,
      prerelease
    } = options;

    const ghConfig = githubUrl ? url.parse(githubUrl) : {};
    const github = new GitHub({
      version: "3.0.0",
      port: ghConfig.port,
      protocol: (ghConfig.protocol || "").split(":")[0] || null,
      host: ghConfig.hostname,
      pathPrefix: githubApiPathPrefix || null
    });

    github.authenticate({
      type: "oauth",
      token: githubToken
    });

    await new Promise((resolv, reject) => {
      github.repos.createRelease({
        user: gitUrl.owner,
        repo: gitUrl.name,
        name: "v" + ver,
        tag_name: "v" + ver,
        target_commitish: head,
        draft: Boolean(draftMode),
        prerelease: Boolean(prerelease),
        body: changelog
      }, (err, res) => {
        err ? reject(err) : resolv(res);
      });
    });
  }

  console.log("Created Github release v%s on commit %s", ver, head.substr(0, 8));
}
