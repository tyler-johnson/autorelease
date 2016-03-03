import pipeline from "./pipeline";
import fetchLatest from "./steps/fetch-latest";
import verify from "./steps/verify";
import nextVersion from "./steps/next-version";

export default async function pre(steps={}, opts={}) {
	if (!Array.isArray(opts)) steps = [
		opts.verify || verify,
		opts.fetchLatest || fetchLatest,
		opts.nextVersion || nextVersion
	];

	await pipeline(steps, opts);
}
