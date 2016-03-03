import minimist from "minimist";

// using standard require so rollup doesn't include it
const autorelease = require("./");

let argv = minimist(process.argv.slice(2), {
	string: [ ],
	boolean: [ "help", "version" ],
	alias: {
		h: "help", H: "help",
		v: "version", V: "version"
	}
});

if (argv.help) {
	console.log("halp plz");
	process.exit(0);
}

if (argv.version) {
	let pkg = require("./package.json");
	console.log("%s %s", pkg.name, pkg.version || "edge");
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
}
