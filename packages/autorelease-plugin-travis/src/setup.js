import promisify from "es6-promisify";
import {find,includes} from "lodash";
import yaml from "js-yaml";
import {stat as _stat,readFile as _readFile,writeFile as _writeFile} from "fs";
import {name as pkgname,version} from "../package.json";
import _request from "request";

const request = promisify(_request);
const stat = promisify(_stat);
const readFile = promisify(_readFile);
const writeFile = promisify(_writeFile);

const travisyml = {
	sudo: false,
	language: "node_js",
	cache: {
		directories: ["node_modules"]
	},
	node_js: ["6"],
	before_install: ["npm install"],
	after_success: ["npm run autorelease"],
	branches: {
		// ignore git tags created by autorelease, like "v1.2.3"
		except: [/^v\d+\.\d+\.\d+$/.toString()]
	}
};

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function syncUser(R, attempt=true) {
	// begin with fetching the user's account to see their current state
	const user = await R({ url: "/users/" });

	if (!user.is_syncing) {
		// no syncing and won't attempt, we are done
		if (!attempt) return user;

		// attempt to sync the user's account
		await R({ method: "POST", url: "/users/sync" });
	}

	// wait a little bit and try again to see if syncing is done
	await sleep(500);
	return await syncUser(R, false);
}

async function fetchEnvVars(R, repoid) {
	return await R({
		url: "/settings/env_vars",
		qs: { repository_id: repoid }
	});
}

async function saveEnvVar(R, repoid, vars, name, value) {
	let evar = find(vars, [ "name", name ]);
	let id = evar ? evar.id : null;

	return await R({
		method: id ? "PATCH" : "POST",
		url: `/settings/env_vars${id ? '/' + id : ''}`,
		qs: { repository_id: repoid },
		body: { env_var: {
			name, value, public: false
		} }
	});
}

export default async function(ctx) {
	ctx.script.before("verify");

	// ensure the github token has been generated
	if (!ctx.githubToken) {
		throw("A github token hasn't been created yet. Please specify the GitHub plugin before Travis.");
	}

	let token;
	const {pro} = await ctx.prompt([{
		type: "confirm",
		name: "pro",
		message: "Are you using Travis CI Pro?",
		default: false
	}]);

	async function R(opts={}) {
		const resp = await request({
			method: "GET",
			baseUrl: "https://api.travis-ci." + (pro ? "com" : "org"),
			json: true,
			...opts,
			headers: {
				...opts.headers,
				"Authorization": !token ? null : "token " + token,
				"User-Agent": `Travis/2.0 ${pkgname}/${version || "edge"}`
			}
		});

		if (resp.statusCode >= 400) {
			throw {
				message: resp.body && resp.body.message ? resp.body.message : "Unkown Travis CI Error",
				status: resp.statusCode
			};
		}

		return resp.body;
	}

	// sign into travis with github token generated from previous step
	token = (await R({
		method: "POST",
		url: "/auth/github",
		body: { github_token: ctx.githubToken }
	})).access_token;

	// sync the user's account with github
	ctx.cli.print("Syncing your Travis CI account to make sure it's up to date.");
	await syncUser(R);

	// fetch repo in question
	let {owner,name} = ctx.gitUrl;
	const repo = await R({
		url: "/repos/" + encodeURIComponent(owner) + "/" + encodeURIComponent(name)
	});

	// ensure that git hooks are enabled on this repo
	const {result} = await R({
		method: "PUT",
		url: "/hooks/" + repo.id,
		body: { hook: { active: true } }
	});
	if (!result) throw("Could not enable hooks for this Travis CI repository");

	// save env variables
	const {env_vars} = await fetchEnvVars(R, repo.id);
	const addvars = [["NPM_TOKEN", ctx.npmToken],["GH_TOKEN", ctx.githubToken]];
	while (addvars.length) {
		const [key,val] = addvars.shift();
		await saveEnvVar(R, repo.id, env_vars, key, val);
	}
	ctx.cli.print(`Saved NPM_TOKEN and GH_TOKEN environment variables to Travis CI.`);

	// check if a travis file exists
	let hasTravisFile;
	try {
		await stat(".travis.yml");
		hasTravisFile = true;
	} catch(e) {
		if (e.code !== "ENOENT") throw e;
		hasTravisFile = false;
	}

	// create a travis.yml file if it does not exist
	if (!hasTravisFile) {
		let {addFile} = await ctx.prompt([{
			type: "confirm",
			name: "addFile",
			message: "No .travis.yml file found. Should I create one?",
			default: true
		}]);

		if (addFile) {
			await writeFile(".travis.yml", yaml.safeDump(travisyml));
			ctx.cli.print("I've created a basic .travis.yml file in your project.");
		}
	}

	// otherwise, add the autorelease script to after_success
	else {
		let tyml = yaml.safeLoad(await readFile(".travis.yml", "utf-8"));
		if (tyml.after_success == null) tyml.after_success = [];
		if (!Array.isArray(tyml.after_success)) tyml.after_success = [tyml.after_success];
		if (!includes(tyml.after_success, "npm run autorelease")) {
			tyml.after_success.push("npm run autorelease");
			await writeFile(".travis.yml", yaml.safeDump(tyml));
			ctx.cli.print("I've added an 'after_success' script to your .travis.yml to run Autorelease.");
		}
	}
}
