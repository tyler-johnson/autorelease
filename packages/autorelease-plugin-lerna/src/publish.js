import {exec} from "autorelease-utils";

export default async function(ctx) {
  const {basedir="."} = ctx;

  const result = await exec("npm publish", {
    cwd: basedir
  });

  console.log(result.trim());
}
