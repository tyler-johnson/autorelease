import fetchPkg from "package-json";

export default async function(r, {version="latest",package:pkg}) {
	if (!pkg.name) {
		throw new Error("Missing a package name.");
	}

	try {
		return await fetchPkg(pkg.name, version);
	} catch(e) {
		if (!/doesn't exist/.test(e.message)) throw e;
	}
}
