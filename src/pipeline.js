import _resolve from "resolve";
import promisify from "es6-promisify";

const resolve = promisify(_resolve, function(err, res) {
	if (err) this.reject(err);
	else this.resolve(Array.isArray(res) ? res[0] : res);
});

export default async function(steps, opts={}) {
	steps = [].concat(steps);
	let {basedir} = opts;
	let res;

	while (steps.length) {
		let step = steps.shift();
		if (!step) continue;

		if (typeof step === "string") {
			step = require(await resolve(step, { basedir }));
		}

		if (Array.isArray(step)) {
			steps.unshift.apply(steps, step);
		} else if (typeof step === "function") {
			res = await step.call(this, res, opts);
		} else {
			throw new Error("Expecting a function or path to module for step.");
		}
	}

	return res;
}
