import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";

export default {
  onwarn: ()=>{},
  format: "cjs",
  plugins: [
    json(),
    babel({
      exclude: "node_modules/**"
    })
  ]
};
