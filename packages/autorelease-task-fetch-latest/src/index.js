import fetchPkg from "package-json";

async function fetch(name, version) {
	try {
		return await fetchPkg(name, version);
	} catch(e) {
		if (!e.message || !/doesn't exist/.test(e.message)) throw e;
		return null;
	}
}

export default async function(ctx) {
  const {options={},package:pkg} = ctx;
  const {version="latest",tag} = options;

	if (!pkg.name) {
		throw "Missing a package name.";
	}

	let latest = tag ? await fetch(pkg.name, tag) : null;
	if (!latest) latest = await fetch(pkg.name, version);
	ctx.latest = latest; // always reset to show there is no latest

	if (latest && latest.version) {
		console.log("Fetched %s@%s", latest.name, latest.version);
	}
}
