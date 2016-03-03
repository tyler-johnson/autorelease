import fetchPkg from "package-json";

export default async function(r, {npmtag="latest",package:pkg}) {
	if (!pkg.name) {
		throw new Error("Missing a package name.");
	}

	try {
		return await fetchPkg(pkg.name, npmtag);
	} catch(e) {
		if (!/doesn't exist/.test(e.message)) throw e;
	}
}
