import {exec as _exec} from "child_process";
import promisify from "es6-promisify";

export default promisify(_exec, function(err, res) {
	if (err) this.reject(err);
	else this.resolve(Array.isArray(res) ? res[0] : res);
});
