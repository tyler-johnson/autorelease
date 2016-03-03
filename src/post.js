import pipeline from "./pipeline";
import options from "./options";
import generateChangelog from "./steps/generate-changelog";
import publishChangelog from "./steps/publish-changelog";

export default async function post(opts={}) {
	opts = await options(opts);
	let steps = opts.post || {};

	if (!Array.isArray(steps)) steps = [
		steps.generateChangelog || generateChangelog,
		steps.publishChangelog || publishChangelog
	];

	await pipeline(steps, opts);
}
