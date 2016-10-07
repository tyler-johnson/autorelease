import {exec as _exec} from "child_process";

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
