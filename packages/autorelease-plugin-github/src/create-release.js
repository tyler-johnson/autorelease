import _gitHead from "git-head";
import GitHub from "github";
import {promisify} from "autorelease-utils";
import {resolve} from "path";
import url from "url";

const gitHead = promisify(_gitHead);

export default async function(ctx) {
  const {
    basedir = ".",
    package: pkg,
    gitUrl,
    options = {},
    changelog = ""
  } = ctx;

  if (!pkg.version) return;

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

  const head = await gitHead(resolve(basedir, ".git"));

  await new Promise((resolv, reject) => {
    github.repos.createRelease({
      user: gitUrl.owner,
      repo: gitUrl.name,
      name: "v" + pkg.version,
      tag_name: "v" + pkg.version,
      target_commitish: head,
      draft: Boolean(draftMode),
      prerelease: Boolean(prerelease),
      body: changelog
    }, (err, res) => {
      err ? reject(err) : resolv(res);
    });
  });

  console.log("Created new Github release for v%s", pkg.version);
}