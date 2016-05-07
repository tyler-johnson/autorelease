import {exec} from "child_process";

export default function(...args) {
	return new Promise((resolve, reject) => {
		exec.apply(null, args.concat(function(err, stdout) {
			err ? reject(err) : resolve(stdout);
		}));
	});
}
