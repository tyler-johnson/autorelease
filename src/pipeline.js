import _resolve from "resolve";
import promisify from "es6-promisify";

const resolve = promisify(_resolve, function(err, res) {
	if (err) this.reject(err);
	else this.resolve(Array.isArray(res) ? res[0] : res);
});

export default async function(steps, opts={}) {
	let {basedir=process.cwd()} = opts;
	steps = [].concat(steps).filter(Boolean);
	let res;

	for (let i = 0; i < steps.length; i++) {
		let step = steps[i];
		if (typeof step === "string" && step) {
			step = require(await resolve(step, { basedir }));
		}
		if (typeof step !== "function") {
			throw new Error("Expecting a function or path to module for step.");
		}
		res = await step.call(this, res, opts);
	}

	return res;
}
