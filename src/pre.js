import pipeline from "./pipeline";
import options from "./options";
import fetchLatest from "./steps/fetch-latest";
import verify from "./steps/verify";
import nextVersion from "./steps/next-version";
import prepPublish from "./steps/prep-publish";
import configureNpm from "./steps/configure-npm";

export default async function pre(opts={}) {
	opts = await options(opts);
	let steps = opts.pre || {};

	if (!Array.isArray(steps)) steps = [
		steps.verify || verify,
		steps.configureNpm || configureNpm,
		steps.fetchLatest || fetchLatest,
		steps.nextVersion || nextVersion,
		steps.prepPublish || prepPublish
	];

	await pipeline(steps, opts);
}
