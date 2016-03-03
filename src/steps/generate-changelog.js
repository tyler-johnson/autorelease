import changelog from "conventional-changelog";

export default async function(r, {changelog:enableChangelog=true,packageFile:pkgfile,preset}) {
	if (!enableChangelog) return;

	let clog = changelog({
		pkg: { path: pkgfile },
		preset
	});

	let data = "";
	clog.setEncoding("utf-8");
	clog.on("data", (c) => data += c);

	await new Promise((resolve, reject) => {
		clog.on("end", resolve);
		clog.on("error", reject);
	});

	return data;
}
