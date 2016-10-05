import fetchPkg from "package-json";

export default async function(ctx) {
  const {options={},package:pkg} = ctx;
  const {version="latest"} = options;

	if (!pkg.name) {
		throw new Error("Missing a package name.");
	}

	try {
		ctx.latest = await fetchPkg(pkg.name, version);
	} catch(e) {
		if (!/doesn't exist/.test(e.message)) throw e;
	}
}
