import minimist from "minimist";
import {name,version} from "../package.json";
import format from "cli-format";

// using standard require so rollup doesn't include it
const autorelease = require("./");

let argv = minimist(process.argv.slice(2), {
	string: [ "config" ],
	boolean: [ "help", "v" ],
	alias: {
		h: "help", H: "help",
		V: "v",
		c: "config"
	}
});

const help = format.wrap(`
${name} ${version}

This is a tool to facilitate the releasing of NPM packages based on Git commit messages. This tool is designed to handled all aspects of publishing Node modules, including:

	- Release verification to ensure the environment is configured correctly before publishing.
	- Bumping package versions using semver according to commit types.
	- Generating changelogs from commit messages.
	- Tagging the commit in Git with the new version.

This is tool is highly configurable and can be adapted using plugins for almost any environment.

This CLI tool is split into two parts, a before release (pre) stage and an after release (post) stage, each with a series of steps. The before release sets up the repository for release, including release verification, bumping the version number and configuring NPM. The after release stage handles changelog generation and git tagging. The steps in these stages can be configured using the '.autoreleaserc' file.

To release a module using this tool, run the following in the command line. It is recommended to add this to an NPM script in the package.json to make this easy to run in the future:

	$ autorelease pre && npm publish && autorelease post

`, {
	paddingLeft: "  ",
	paddingRight: "  "
});

if (argv.help) {
	console.log(help);
	process.exit(0);
}

if (argv.v) {
	console.log("%s %s", name, version || "edge");
	process.exit(0);
}

function panic(e) {
	console.error(e.stack || e);
	process.exit(1);
}

switch (argv._[0]) {
	case "pre":
		autorelease.pre(argv).catch(panic);
		break;

	case "post":
		autorelease.post(argv).catch(panic);
		break;

	default:
		console.log(help);
}
