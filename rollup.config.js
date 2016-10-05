import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";

export default {
	onwarn: ()=>{},
	format: "cjs",
	plugins: [
		babel({
			exclude: 'node_modules/**'
		}),
		json()
	]
};
