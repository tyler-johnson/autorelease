import pipeline from "./pipeline";
import options from "./options";
import fetchLatest from "./steps/fetch-latest";
import verify from "./steps/verify";
import nextVersion from "./steps/next-version";
import saveVersion from "./steps/save-version";

export default async function pre(opts={}) {
	opts = await options(opts);
	let steps = opts.pre || {};

	if (!Array.isArray(steps)) steps = [
		steps.verify || verify,
		steps.fetchLatest || fetchLatest,
		steps.nextVersion || nextVersion,
		steps.saveVersion || saveVersion
	];

	await pipeline(steps, opts);
}
