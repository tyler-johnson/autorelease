import promisify from "es6-promisify";
import _request from "request";
import {randomBytes} from "crypto";
import gitRemote from "autorelease-task-git-remote";

const request = promisify(_request);

async function fetchOTP(ctx) {
	return (await ctx.prompt([{
		type: "input",
		name: "code",
		message: "What is your GitHub two-factor authentication code?"
	}])).code;
}

async function authorize(ctx, auth, note, otp, retry) {
	const resp = await request({
		method: "POST",
		url: "https://api.github.com/authorizations",
		json: true,
		auth,
		headers: {
			"User-Agent": "autorelease",
			"X-GitHub-OTP": otp
		},
		body: {
			scopes: [
				"repo",
				"read:org",
				"user:email",
				"write:repo_hook"
			],
			note: note
		}
	});

	if (resp.statusCode === 201) return resp.body.token;

	if (resp.statusCode === 401 && resp.headers["x-github-otp"]) {
		const type = resp.headers["x-github-otp"].split('; ')[1];

		if (retry) {
			console.warn("Invalid two-factor authentication code.");
		} else {
			ctx.cli.print(`Two-factor authentication code needed via ${type}.`);
		}

		return await authorize(ctx, auth, note, await fetchOTP(ctx), true);
	}

	console.warn("Failed to login into GitHub.");
}

export default async function(ctx) {
  ctx.script.before("verify");
  ctx.script.after("post");

	const remote = await gitRemote(ctx);
	if (remote == null || remote.source !== "github.com") {
		throw(`Repository URL does not seem to be from Github.`);
	}

  let auth = await ctx.prompt([{
		type: "input",
		name: "username",
		message: "What is your GitHub username?"
	}, {
		type: "password",
		name: "password",
		message: "What is your GitHub password?"
	}]);

	const {owner,name} = remote;
	const tokenName = `autorelease-${owner}-${name}-${randomBytes(4).toString("hex")}`;
	const token = await authorize(ctx, auth, tokenName);

	if (token) {
		ctx.githubToken = token;
		ctx.cli.print(`Thanks! Here is your GitHub token: ${token}`);
		ctx.cli.print("Depending on your environment, you may need to manually set this to the GH_TOKEN env var.");
	}
}
