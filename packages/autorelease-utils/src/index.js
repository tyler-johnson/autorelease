import {exec as _exec} from "child_process";
import registryUrl from "registry-url";
import nerfDart from "nerf-dart";
import * as cli from "./cli-utils";
import treeify from "./treeify";

export {cli,treeify};

export function promisify(fn) {
	return function(...args) {
		return new Promise((res, rej) => {
			fn.apply(this, args.concat((e, r) => e ? rej(e) : res(r)));
		});
	};
}

export const exec = promisify(_exec);

export async function unsafeExec(...args) {
	try { await exec(...args); }
	catch(e) { /* eat errors */ }
}

export function addVersion(autorelease, name, version) {
	autorelease.pipeline("version").add(() => {
    console.log("%s %s", name, version);
  });
}

export function getRegistryUrl(pkg={}) {
	let registry;

	if (pkg.publishConfig && pkg.publishConfig.registry) {
		registry = pkg.publishConfig.registry;
	} else {
		registry = registryUrl(pkg.name.split("/")[0]);
	}

	if (!registry) {
		throw "Could not locate NPM registry URL.";
	}

	return nerfDart(registry);
}
